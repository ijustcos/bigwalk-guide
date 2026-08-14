import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { clearAdminSession, createAdminSession, validAdminPassword } from '@/lib/admin-auth'
import { getClientIp, publicSourceHash, verifyTurnstile } from '@/lib/lfg'
import { getDb } from '@/lib/neon'

const loginSchema = z.object({
  password: z.string().min(1).max(256),
  turnstileToken: z.string().optional(),
})

export async function POST(request: NextRequest) {
  const sql = getDb()
  if (!sql) return NextResponse.json({ error: 'Database not configured.' }, { status: 503 })
  const parsed = loginSchema.safeParse(await request.json())
  if (!parsed.success)
    return NextResponse.json({ error: 'Invalid login request.' }, { status: 400 })
  const ip = getClientIp(request)
  const sourceHash = publicSourceHash(ip)
  const [{ recent_count: recentCount }] = await sql`
    select count(*)::integer as recent_count
    from admin_login_attempts
    where source_hash = ${sourceHash}
      and attempted_at > now() - interval '15 minutes'
  `
  if (Number(recentCount) >= 5)
    return NextResponse.json(
      { error: 'Too many login attempts. Please try again in 15 minutes.' },
      { status: 429 }
    )
  const verified = await verifyTurnstile(parsed.data.turnstileToken, ip, 'admin_login')
  if (!verified || !validAdminPassword(parsed.data.password)) {
    await sql`insert into admin_login_attempts (source_hash) values (${sourceHash})`
    return NextResponse.json({ error: 'Incorrect administrator password.' }, { status: 401 })
  }
  await sql`delete from admin_login_attempts where source_hash = ${sourceHash}`
  await createAdminSession()
  return NextResponse.json({ ok: true })
}
export async function DELETE() {
  await clearAdminSession()
  return NextResponse.json({ ok: true })
}
