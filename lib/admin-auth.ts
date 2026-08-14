import { createHmac, timingSafeEqual } from 'crypto'
import { cookies } from 'next/headers'

const cookieName = 'bw_admin'
function sessionSecret() {
  const secret = process.env.ADMIN_SESSION_SECRET
  if (!secret && process.env.NODE_ENV === 'production') {
    throw new Error('ADMIN_SESSION_SECRET is required in production.')
  }
  return secret || 'local-development-only'
}

function signature() {
  return createHmac('sha256', sessionSecret()).update('bigwalk-admin').digest('hex')
}

export function validAdminPassword(candidate: string) {
  const password = process.env.ADMIN_PASSWORD
  if (!password || candidate.length !== password.length) return false
  return timingSafeEqual(Buffer.from(candidate), Buffer.from(password))
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
