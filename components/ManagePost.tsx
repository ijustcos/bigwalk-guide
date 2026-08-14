'use client'

import { useState } from 'react'
import { CheckCircle2, Clock3, Trash2 } from 'lucide-react'

export default function ManagePost({ id, token }: { id: string; token: string }) {
  const [message, setMessage] = useState(
    'Use this private page to close, extend or remove your listing.'
  )
  const [busy, setBusy] = useState(false)
  async function action(value: string) {
    if (value === 'delete' && !confirm('Remove this listing?')) return
    setBusy(true)
    const response = await fetch(`/api/lfg/${id}`, {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ action: value, manageToken: token }),
    })
    const data = await response.json()
    setMessage(
      response.ok ? 'Your listing has been updated.' : data.error || 'Unable to update listing.'
    )
    setBusy(false)
  }
  return (
    <div className="mx-auto max-w-xl py-16">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <span className="text-xs font-black tracking-[0.18em] text-[#1f6b5b] uppercase dark:text-emerald-300">
          Private management link
        </span>
        <h1 className="mt-3 text-3xl font-black">Manage your group</h1>
        <p className="mt-3 leading-7 text-slate-500 dark:text-slate-400">{message}</p>
        <div className="mt-8 grid gap-3">
          <button
            disabled={busy}
            onClick={() => action('close')}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#153f38] px-5 py-3 font-bold text-white"
          >
            <CheckCircle2 size={18} /> Mark group full
          </button>
          <button
            disabled={busy}
            onClick={() => action('extend')}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 px-5 py-3 font-bold"
          >
            <Clock3 size={18} /> Extend for 6 hours
          </button>
          <button
            disabled={busy}
            onClick={() => action('delete')}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 px-5 py-3 font-bold text-red-700"
          >
            <Trash2 size={18} /> Delete listing
          </button>
        </div>
        <p className="mt-7 text-xs leading-5 text-slate-400">
          Anyone with this exact URL can manage the listing. Do not share it publicly.
        </p>
      </div>
    </div>
  )
}
