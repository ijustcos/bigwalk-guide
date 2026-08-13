import ManagePost from '@/components/ManagePost'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Manage group listing',
  robots: { index: false, follow: false },
}
export default async function Page({ params }: { params: Promise<{ id: string; token: string }> }) {
  const { id, token } = await params
  return <ManagePost id={id} token={token} />
}
