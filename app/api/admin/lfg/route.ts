import { NextRequest, NextResponse } from 'next/server'
import { isAdmin } from '@/lib/admin-auth'
import { mapPost } from '@/lib/lfg'
import { getDb } from '@/lib/neon'

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const sql = getDb()
  if (!sql) return NextResponse.json({ posts: [], configured: false })
  try {
    const posts = await sql`select * from lfg_posts order by created_at desc limit 250`
    return NextResponse.json({ posts: posts.map(mapPost), configured: true })
  } catch (error) {
    console.error('Unable to load admin LFG posts', error)
    return NextResponse.json({ error: 'Unable to load posts.' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const sql = getDb()
  if (!sql) return NextResponse.json({ error: 'Database not configured.' }, { status: 503 })
  const { id, action } = await request.json()
  const states: Record<string, string> = {
    hide: 'Hidden',
    restore: 'Active',
    expire: 'Expired',
    delete: 'Deleted',
    full: 'Group Full',
  }
  if (!id || !states[action])
    return NextResponse.json({ error: 'Invalid action.' }, { status: 400 })
  const changed = await sql`
    with updated as (
      update lfg_posts
      set status = ${states[action]}, updated_at = now()
      where id::text = ${id}
      returning id
    )
    insert into admin_actions (action, target_id)
    select ${action}, id from updated
    returning target_id
  `
  if (!changed.length) return NextResponse.json({ error: 'Post not found.' }, { status: 404 })
  return NextResponse.json({ ok: true })
}
