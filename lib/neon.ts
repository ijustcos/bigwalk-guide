import { neon, type NeonQueryFunction } from '@neondatabase/serverless'

let client: NeonQueryFunction<false, false> | null = null

export function getDb() {
  const connectionString = process.env.DATABASE_URL
  if (!connectionString) return null
  client ??= neon(connectionString)
  return client
}
