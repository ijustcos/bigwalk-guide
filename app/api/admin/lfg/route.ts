import { NextRequest, NextResponse } from 'next/server'
import { isAdmin } from '@/lib/admin-auth'
import { getAdminDb } from '@/lib/supabase-admin'
import { mapPost } from '@/lib/lfg'

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const db = getAdminDb()
  if (!db) return NextResponse.json({ posts: [], configured: false })
  const { data, error } = await db
    .from('lfg_posts')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(250)
  if (error) return NextResponse.json({ error: 'Unable to load posts.' }, { status: 500 })
  return NextResponse.json({ posts: (data || []).map(mapPost), configured: true })
}

export async function PATCH(request: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const db = getAdminDb()
  if (!db) return NextResponse.json({ error: 'Database not configured.' }, { status: 503 })
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
  await db
    .from('lfg_posts')
    .update({ status: states[action], updated_at: new Date().toISOString() })
    .eq('id', id)
  await db.from('admin_actions').insert({ action, target_id: id })
  return NextResponse.json({ ok: true })
}
