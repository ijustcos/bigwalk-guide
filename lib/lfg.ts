import { createHash, randomBytes } from 'crypto'
import { z } from 'zod'

export const platforms = ['PC', 'PS5', 'Switch 2'] as const
export const regions = ['Americas', 'Europe', 'Asia', 'Oceania'] as const

export const lfgPostSchema = z
  .object({
    displayName: z.string().trim().min(2).max(24),
    platform: z.enum(platforms),
    region: z.enum(regions),
    language: z.string().trim().min(2).max(30),
    groupType: z.enum(['Hosting', 'Looking to join', 'Either']),
    availability: z.enum(['Playing now', 'Today', 'Later']),
    playersNeeded: z.coerce.number().int().min(1).max(11),
    microphone: z.enum(['Required', 'Optional', 'No mic']),
    experience: z.enum(['New', 'Some progress', 'Experienced']),
    goal: z.string().trim().min(2).max(80),
    message: z.string().trim().max(160).optional().default(''),
    joinCode: z.string().trim().max(24).optional().default(''),
    lifetime: z.coerce
      .number()
      .int()
      .refine((value) => [2, 6, 24].includes(value)),
    turnstileToken: z.string().optional(),
  })
  .superRefine((value, context) => {
    if (value.groupType === 'Hosting' && value.joinCode.length < 3) {
      context.addIssue({
        code: 'custom',
        path: ['joinCode'],
        message: 'A Join Code is required when hosting.',
      })
    }
  })

export const reportSchema = z.object({
  reason: z.enum([
    'Spam',
    'Harassment',
    'Inappropriate content',
    'Personal information',
    'Invalid or expired code',
    'Suspicious link',
    'Other',
  ]),
})

export function createManageToken() {
  return randomBytes(24).toString('base64url')
}
export function hashValue(value: string) {
  return createHash('sha256').update(value).digest('hex')
}
export function publicSourceHash(ip: string) {
  const salt = process.env.SOURCE_HASH_SALT
  if (!salt && process.env.NODE_ENV === 'production') {
    throw new Error('SOURCE_HASH_SALT is required in production.')
  }
  return hashValue(`${salt || 'local-development-only'}:${ip}`)
}

export function getClientIp(request: Request) {
  return (
    request.headers.get('cf-connecting-ip') ||
    request.headers.get('x-real-ip') ||
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    'unknown'
  )
}

export async function verifyTurnstile(
  token: string | undefined,
  ip: string,
  expectedAction: string
) {
  const secret = process.env.TURNSTILE_SECRET_KEY
  if (!secret) return process.env.NODE_ENV !== 'production'
  if (!token) return false
  try {
    const form = new FormData()
    form.append('secret', secret)
    form.append('response', token)
    form.append('remoteip', ip)
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: form,
      signal: AbortSignal.timeout(10_000),
    })
    if (!response.ok) return false
    const result = (await response.json()) as {
      success?: boolean
      action?: string
      hostname?: string
    }
    const allowedHostnames = (
      process.env.TURNSTILE_HOSTNAMES || 'bigwalkhub.online,www.bigwalkhub.online'
    )
      .split(',')
      .map((hostname) => hostname.trim())
      .filter(Boolean)
    return (
      result.success === true &&
      result.action === expectedAction &&
      Boolean(result.hostname && allowedHostnames.includes(result.hostname))
    )
  } catch (error) {
    console.error('Turnstile verification failed', error)
    return false
  }
}

export type PublicLfgPost = {
  id: string
  displayName: string
  platform: string
  region: string
  language: string
  groupType: string
  availability: string
  playersNeeded: number
  microphone: string
  experience: string
  goal: string
  message: string
  joinCode: string
  status: string
  createdAt: string
  expiresAt: string
  reportCount?: number
}

export function mapPost(row: Record<string, unknown>): PublicLfgPost {
  return {
    id: String(row.id),
    displayName: String(row.display_name),
    platform: String(row.platform),
    region: String(row.region),
    language: String(row.language),
    groupType: String(row.group_type),
    availability: String(row.availability),
    playersNeeded: Number(row.players_needed),
    microphone: String(row.microphone),
    experience: String(row.experience),
    goal: String(row.goal),
    message: String(row.message || ''),
    joinCode: String(row.join_code || ''),
    status: String(row.status),
    createdAt: String(row.created_at),
    expiresAt: String(row.expires_at),
    reportCount: Number(row.report_count || 0),
  }
}
