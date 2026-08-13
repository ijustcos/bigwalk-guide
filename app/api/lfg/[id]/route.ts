import { NextRequest, NextResponse } from 'next/server'
import { getAdminDb } from '@/lib/supabase-admin'
import { hashValue, reportSchema } from '@/lib/lfg'

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const db = getAdminDb()
  if (!db) return NextResponse.json({ error: 'Database not configured.' }, { status: 503 })
  const { id } = await params
  const body = await request.json()
  if (!body.manageToken)
    return NextResponse.json({ error: 'Management link required.' }, { status: 401 })
  const { data: post } = await db
    .from('lfg_posts')
    .select('manage_token_hash')
    .eq('id', id)
    .single()
  if (!post || post.manage_token_hash !== hashValue(body.manageToken))
    return NextResponse.json({ error: 'Invalid management link.' }, { status: 403 })
  const updates: Record<string, unknown> = { updated_at: new Date().toISOString() }
  if (body.action === 'close') updates.status = 'Group Full'
  else if (body.action === 'delete') updates.status = 'Deleted'
  else if (body.action === 'extend') {
    updates.status = 'Active'
    updates.expires_at = new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString()
  } else return NextResponse.json({ error: 'Unknown action.' }, { status: 400 })
  await db.from('lfg_posts').update(updates).eq('id', id)
  return NextResponse.json({ ok: true })
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const db = getAdminDb()
  if (!db) return NextResponse.json({ error: 'Database not configured.' }, { status: 503 })
  const parsed = reportSchema.safeParse(await request.json())
  if (!parsed.success) return NextResponse.json({ error: 'Choose a reason.' }, { status: 400 })
  const { id } = await params
  await db.from('lfg_reports').insert({ post_id: id, reason: parsed.data.reason })
  const { data } = await db.from('lfg_posts').select('report_count').eq('id', id).single()
  const count = Number(data?.report_count || 0) + 1
  await db
    .from('lfg_posts')
    .update({ report_count: count, ...(count >= 3 ? { status: 'Hidden' } : {}) })
    .eq('id', id)
  return NextResponse.json({ ok: true })
}
