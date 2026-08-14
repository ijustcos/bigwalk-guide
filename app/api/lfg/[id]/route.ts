import { NextRequest, NextResponse } from 'next/server'
import { getClientIp, hashValue, publicSourceHash, reportSchema } from '@/lib/lfg'
import { getDb } from '@/lib/neon'

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const sql = getDb()
  if (!sql) return NextResponse.json({ error: 'Database not configured.' }, { status: 503 })
  const { id } = await params
  const body = await request.json()
  if (!body.manageToken)
    return NextResponse.json({ error: 'Management link required.' }, { status: 401 })
  const [post] = await sql`
    select manage_token_hash from lfg_posts where id::text = ${id} limit 1
  `
  if (!post || post.manage_token_hash !== hashValue(body.manageToken))
    return NextResponse.json({ error: 'Invalid management link.' }, { status: 403 })
  if (body.action === 'close')
    await sql`update lfg_posts set status = 'Group Full', updated_at = now() where id::text = ${id}`
  else if (body.action === 'delete')
    await sql`update lfg_posts set status = 'Deleted', updated_at = now() where id::text = ${id}`
  else if (body.action === 'extend') {
    await sql`
      update lfg_posts
      set status = 'Active', expires_at = now() + interval '6 hours', updated_at = now()
      where id::text = ${id}
    `
  } else return NextResponse.json({ error: 'Unknown action.' }, { status: 400 })
  return NextResponse.json({ ok: true })
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const sql = getDb()
  if (!sql) return NextResponse.json({ error: 'Database not configured.' }, { status: 503 })
  const parsed = reportSchema.safeParse(await request.json())
  if (!parsed.success) return NextResponse.json({ error: 'Choose a reason.' }, { status: 400 })
  const { id } = await params
  const sourceHash = publicSourceHash(getClientIp(request))
  const [{ recent_count: recentCount }] = await sql`
    select count(*)::integer as recent_count
    from lfg_reports
    where source_hash = ${sourceHash}
      and created_at > now() - interval '1 hour'
  `
  if (Number(recentCount) >= 10)
    return NextResponse.json(
      { error: 'Too many reports. Please try again later.' },
      { status: 429 }
    )
  const updated = await sql`
    with target as (
      select id from lfg_posts where id::text = ${id}
    ), report as (
      insert into lfg_reports (post_id, reason, source_hash)
      select id, ${parsed.data.reason}, ${sourceHash} from target
      on conflict do nothing
      returning post_id
    )
    update lfg_posts
    set report_count = report_count + 1,
        status = case when report_count + 1 >= 3 then 'Hidden' else status end,
        updated_at = now()
    where id in (select post_id from report)
    returning id
  `
  if (!updated.length) {
    const [post] = await sql`select id from lfg_posts where id::text = ${id} limit 1`
    if (!post) return NextResponse.json({ error: 'Post not found.' }, { status: 404 })
    return NextResponse.json({ error: 'You already reported this post.' }, { status: 409 })
  }
  return NextResponse.json({ ok: true })
}
