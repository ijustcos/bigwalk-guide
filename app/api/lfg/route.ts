import { NextRequest, NextResponse } from 'next/server'
import {
  createManageToken,
  hashValue,
  lfgPostSchema,
  mapPost,
  publicSourceHash,
  verifyTurnstile,
} from '@/lib/lfg'
import { getAdminDb } from '@/lib/supabase-admin'

export async function GET() {
  const db = getAdminDb()
  if (!db) return NextResponse.json({ posts: [], configured: false })
  await db
    .from('lfg_posts')
    .update({ status: 'Expired' })
    .eq('status', 'Active')
    .lt('expires_at', new Date().toISOString())
  const { data, error } = await db
    .from('lfg_posts')
    .select('*')
    .eq('status', 'Active')
    .gt('expires_at', new Date().toISOString())
    .order('created_at', { ascending: false })
    .limit(100)
  if (error) return NextResponse.json({ error: 'Unable to load groups.' }, { status: 500 })
  return NextResponse.json({ posts: (data || []).map(mapPost), configured: true })
}

export async function POST(request: NextRequest) {
  const db = getAdminDb()
  if (!db)
    return NextResponse.json(
      { error: 'Posting will open when the live database is connected.' },
      { status: 503 }
    )
  const parsed = lfgPostSchema.safeParse(await request.json())
  if (!parsed.success)
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message || 'Check the form.' },
      { status: 400 }
    )
  if (/https?:\/\/|discord\.gg|@everyone/i.test(parsed.data.message))
    return NextResponse.json({ error: 'Links are not allowed in posts.' }, { status: 400 })
  const ip =
    request.headers.get('cf-connecting-ip') ||
    request.headers.get('x-forwarded-for')?.split(',')[0] ||
    'unknown'
  if (!(await verifyTurnstile(parsed.data.turnstileToken, ip)))
    return NextResponse.json({ error: 'Please complete the security check.' }, { status: 400 })
  const sourceHash = publicSourceHash(ip)
  const { count } = await db
    .from('lfg_posts')
    .select('id', { count: 'exact', head: true })
    .eq('source_hash', sourceHash)
    .eq('status', 'Active')
    .gt('expires_at', new Date().toISOString())
  if ((count || 0) >= 3)
    return NextResponse.json(
      { error: 'You already have the maximum number of active posts.' },
      { status: 429 }
    )
  const token = createManageToken()
  const expiresAt = new Date(Date.now() + parsed.data.lifetime * 60 * 60 * 1000).toISOString()
  const row = parsed.data
  const { data, error } = await db
    .from('lfg_posts')
    .insert({
      display_name: row.displayName,
      platform: row.platform,
      region: row.region,
      language: row.language,
      group_type: row.groupType,
      availability: row.availability,
      players_needed: row.playersNeeded,
      microphone: row.microphone,
      experience: row.experience,
      goal: row.goal,
      message: row.message,
      join_code: row.joinCode,
      expires_at: expiresAt,
      manage_token_hash: hashValue(token),
      source_hash: sourceHash,
    })
    .select('*')
    .single()
  if (error) return NextResponse.json({ error: 'Unable to publish this group.' }, { status: 500 })
  return NextResponse.json({ post: mapPost(data), manageToken: token }, { status: 201 })
}
