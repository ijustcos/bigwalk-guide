import { NextRequest, NextResponse } from 'next/server'
import { clearAdminSession, createAdminSession } from '@/lib/admin-auth'

export async function POST(request: NextRequest) {
  const { password } = await request.json()
  if (!process.env.ADMIN_PASSWORD || password !== process.env.ADMIN_PASSWORD)
    return NextResponse.json({ error: 'Incorrect administrator password.' }, { status: 401 })
  await createAdminSession()
  return NextResponse.json({ ok: true })
}
export async function DELETE() {
  await clearAdminSession()
  return NextResponse.json({ ok: true })
}
