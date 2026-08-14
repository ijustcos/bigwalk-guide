import { NextRequest, NextResponse } from 'next/server'
import {
  createManageToken,
  getClientIp,
  hashValue,
  lfgPostSchema,
  mapPost,
  publicSourceHash,
  verifyTurnstile,
} from '@/lib/lfg'
import { getDb } from '@/lib/neon'

export async function GET() {
  const sql = getDb()
  if (!sql) return NextResponse.json({ posts: [], configured: false })
  try {
    await sql`
      update lfg_posts
      set status = 'Expired', updated_at = now()
      where status = 'Active' and expires_at < now()
    `
    const posts = await sql`
      select * from lfg_posts
      where status = 'Active' and expires_at > now()
      order by created_at desc
      limit 100
    `
    return NextResponse.json({ posts: posts.map(mapPost), configured: true })
  } catch (error) {
    console.error('Unable to load LFG posts', error)
    return NextResponse.json({ error: 'Unable to load groups.' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const sql = getDb()
  if (!sql)
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
  const ip = getClientIp(request)
  if (!(await verifyTurnstile(parsed.data.turnstileToken, ip, 'lfg_post')))
    return NextResponse.json({ error: 'Please complete the security check.' }, { status: 400 })
  const sourceHash = publicSourceHash(ip)
  try {
    const [{ active_count: activeCount }] = await sql`
      select count(*)::integer as active_count
      from lfg_posts
      where source_hash = ${sourceHash}
        and status = 'Active'
        and expires_at > now()
    `
    if (Number(activeCount) >= 3)
      return NextResponse.json(
        { error: 'You already have the maximum number of active posts.' },
        { status: 429 }
      )

    const [{ recent_count: recentCount }] = await sql`
      select count(*)::integer as recent_count
      from lfg_posts
      where source_hash = ${sourceHash}
        and created_at > now() - interval '1 hour'
    `
    if (Number(recentCount) >= 5)
      return NextResponse.json(
        { error: 'Too many posts from this connection. Please try again later.' },
        { status: 429 }
      )

    const token = createManageToken()
    const expiresAt = new Date(Date.now() + parsed.data.lifetime * 60 * 60 * 1000).toISOString()
    const row = parsed.data
    const [post] = await sql`
      insert into lfg_posts (
        display_name, platform, region, language, group_type, availability,
        players_needed, microphone, experience, goal, message, join_code,
        expires_at, manage_token_hash, source_hash
      ) values (
        ${row.displayName}, ${row.platform}, ${row.region}, ${row.language},
        ${row.groupType}, ${row.availability}, ${row.playersNeeded},
        ${row.microphone}, ${row.experience}, ${row.goal}, ${row.message},
        ${row.joinCode}, ${expiresAt}, ${hashValue(token)}, ${sourceHash}
      )
      returning *
    `
    return NextResponse.json({ post: mapPost(post), manageToken: token }, { status: 201 })
  } catch (error) {
    console.error('Unable to publish LFG post', error)
    return NextResponse.json({ error: 'Unable to publish this group.' }, { status: 500 })
  }
}
