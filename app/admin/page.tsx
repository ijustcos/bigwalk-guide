import AdminLfg from '@/components/AdminLfg'
import { isAdmin } from '@/lib/admin-auth'
import { Metadata } from 'next'

export const metadata: Metadata = { title: 'Admin', robots: { index: false, follow: false } }
export default async function AdminPage() {
  return <AdminLfg authenticated={await isAdmin()} />
}
