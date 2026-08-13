'use client'

import { useState } from 'react'
import { Eye } from 'lucide-react'

export default function Spoiler({
  label = 'Reveal solution',
  children,
}: {
  label?: string
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(false)
  return (
    <div className="not-prose my-5 overflow-hidden rounded-2xl border border-amber-300/70 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/30">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left font-bold text-amber-950 dark:text-amber-100"
      >
        <span className="flex items-center gap-2">
          <Eye size={18} /> {open ? 'Hide spoiler' : label}
        </span>
        <span aria-hidden>{open ? '−' : '+'}</span>
      </button>
      {open && (
        <div className="border-t border-amber-200 px-5 py-4 leading-7 text-slate-700 dark:border-amber-900 dark:text-slate-200">
          {children}
        </div>
      )}
    </div>
  )
}
