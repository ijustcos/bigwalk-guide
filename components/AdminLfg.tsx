'use client'

import { FormEvent, useEffect, useMemo, useState } from 'react'
import type { PublicLfgPost } from '@/lib/lfg'
import { Eye, EyeOff, LogOut, RefreshCw, Search, Trash2 } from 'lucide-react'

export default function AdminLfg({ authenticated }: { authenticated: boolean }) {
  const [loggedIn, setLoggedIn] = useState(authenticated)
  const [posts, setPosts] = useState<PublicLfgPost[]>([])
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('All')
  const [message, setMessage] = useState('')
  async function load() {
    const response = await fetch('/api/admin/lfg', { cache: 'no-store' })
    if (response.ok) {
      const data = await response.json()
      setPosts(data.posts || [])
    }
  }
  useEffect(() => {
    if (loggedIn) load()
  }, [loggedIn])
  async function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const password = String(new FormData(event.currentTarget).get('password') || '')
    const response = await fetch('/api/admin/session', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ password }),
    })
    if (response.ok) setLoggedIn(true)
    else setMessage('Incorrect administrator password.')
  }
  async function action(id: string, value: string) {
    await fetch('/api/admin/lfg', {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ id, action: value }),
    })
    await load()
  }
  const filtered = useMemo(
    () =>
      posts.filter(
        (post) =>
          (status === 'All' || post.status === status) &&
          `${post.displayName} ${post.joinCode} ${post.platform} ${post.region}`
            .toLowerCase()
            .includes(query.toLowerCase())
      ),
    [posts, query, status]
  )
  if (!loggedIn)
    return (
      <div className="mx-auto max-w-md py-20">
        <form
          onSubmit={login}
          className="rounded-3xl border border-slate-200 bg-white p-8 shadow-lg dark:border-slate-800 dark:bg-slate-900"
        >
          <div className="text-xs font-black tracking-[0.18em] text-[#1f6b5b] uppercase">
            Private area
          </div>
          <h1 className="mt-3 text-3xl font-black">Administrator</h1>
          <p className="mt-2 text-sm text-slate-500">Enter the private administrator password.</p>
          <input
            type="password"
            name="password"
            required
            className="mt-6 w-full rounded-xl border-slate-300 dark:border-slate-700 dark:bg-slate-950"
          />
          <button className="mt-3 w-full rounded-xl bg-[#153f38] px-5 py-3 font-bold text-white">
            Sign in
          </button>
          {message && <p className="mt-3 text-sm text-red-600">{message}</p>}
        </form>
      </div>
    )
  return (
    <div className="py-10">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <div className="text-xs font-black tracking-[0.18em] text-[#1f6b5b] uppercase">
            Moderation
          </div>
          <h1 className="mt-2 text-4xl font-black">Find Players admin</h1>
          <p className="mt-2 text-slate-500">
            {posts.length} total listings · {posts.filter((p) => p.status === 'Active').length}{' '}
            active · {posts.filter((p) => (p.reportCount || 0) > 0).length} reported
          </p>
        </div>
        <button
          onClick={async () => {
            await fetch('/api/admin/session', { method: 'DELETE' })
            setLoggedIn(false)
          }}
          className="inline-flex items-center gap-2 text-sm font-bold text-slate-500"
        >
          <LogOut size={17} /> Sign out
        </button>
      </div>
      <div className="mt-8 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 sm:flex-row dark:border-slate-800 dark:bg-slate-900">
        <label className="relative flex-1">
          <Search className="absolute top-3 left-3 text-slate-400" size={18} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name, code, platform…"
            className="w-full rounded-xl border-slate-300 py-2.5 pl-10 dark:border-slate-700 dark:bg-slate-950"
          />
        </label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="rounded-xl border-slate-300 dark:border-slate-700 dark:bg-slate-950"
        >
          {['All', 'Active', 'Hidden', 'Group Full', 'Expired', 'Deleted'].map((v) => (
            <option key={v}>{v}</option>
          ))}
        </select>
        <button
          onClick={load}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 px-4 font-bold"
        >
          <RefreshCw size={17} /> Refresh
        </button>
      </div>
      <div className="mt-5 overflow-x-auto rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="bg-slate-100 text-xs tracking-wider text-slate-500 uppercase dark:bg-slate-800">
            <tr>
              {[
                'Status',
                'Player',
                'Platform / region',
                'Goal',
                'Join Code',
                'Reports',
                'Created',
                'Actions',
              ].map((h) => (
                <th key={h} className="px-4 py-3">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((post) => (
              <tr key={post.id} className="border-t border-slate-100 dark:border-slate-800">
                <td className="px-4 py-3 font-bold">{post.status}</td>
                <td className="px-4 py-3">{post.displayName}</td>
                <td className="px-4 py-3">
                  {post.platform} · {post.region}
                </td>
                <td className="max-w-xs px-4 py-3">{post.goal}</td>
                <td className="px-4 py-3 font-mono">{post.joinCode || '—'}</td>
                <td className="px-4 py-3">{post.reportCount || 0}</td>
                <td className="px-4 py-3 text-slate-500">
                  {new Date(post.createdAt).toLocaleString()}
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-1">
                    {post.status === 'Hidden' ? (
                      <button
                        onClick={() => action(post.id, 'restore')}
                        className="p-2 text-emerald-700"
                        title="Restore"
                      >
                        <Eye size={17} />
                      </button>
                    ) : (
                      <button
                        onClick={() => action(post.id, 'hide')}
                        className="p-2 text-amber-700"
                        title="Hide"
                      >
                        <EyeOff size={17} />
                      </button>
                    )}
                    <button
                      onClick={() => action(post.id, 'delete')}
                      className="p-2 text-red-700"
                      title="Delete"
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="p-10 text-center text-slate-500">No matching posts.</div>
        )}
      </div>
    </div>
  )
}
