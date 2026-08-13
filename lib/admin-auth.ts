import { createHmac, timingSafeEqual } from 'crypto'
import { cookies } from 'next/headers'

const cookieName = 'bw_admin'
function signature() {
  return createHmac('sha256', process.env.ADMIN_SESSION_SECRET || 'local-preview-only')
    .update('bigwalk-admin')
    .digest('hex')
}

export async function isAdmin() {
  const value = (await cookies()).get(cookieName)?.value
  if (!value) return false
  const expected = signature()
  if (value.length !== expected.length) return false
  return timingSafeEqual(Buffer.from(value), Buffer.from(expected))
}

export async function createAdminSession() {
  ;(await cookies()).set(cookieName, signature(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 12,
    // The admin dashboard calls /api/admin/*, so the session must be
    // available to both the page and its API routes.
    path: '/',
  })
}

export async function clearAdminSession() {
  ;(await cookies()).delete(cookieName)
}
