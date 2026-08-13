'use client'

import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import { ArrowRight, Search, X } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import Link from './Link'

type SearchDocument = {
  title: string
  path: string
  summary?: string
  category?: string
  tags?: string[]
  aliases?: string[]
}

export default function SearchButton() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [documents, setDocuments] = useState<SearchDocument[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!open || documents.length) return
    let active = true
    setLoading(true)
    fetch('/search.json')
      .then((response) => {
        if (!response.ok) throw new Error('Search index unavailable')
        return response.json()
      })
      .then((data: SearchDocument[]) => {
        if (active) setDocuments(data)
      })
      .catch(() => {
        if (active) setDocuments([])
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [documents.length, open])

  const results = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    if (!normalized) return documents.slice(0, 6)
    return documents
      .filter((document) =>
        [
          document.title,
          document.summary,
          document.category,
          ...(document.tags || []),
          ...(document.aliases || []),
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()
          .includes(normalized)
      )
      .slice(0, 8)
  }, [documents, query])

  return (
    <>
      <button
        type="button"
        aria-label="Search"
        onClick={() => setOpen(true)}
        className="grid h-11 w-11 shrink-0 place-items-center rounded-full text-slate-700 transition hover:bg-white hover:text-[#1f6b5b] dark:text-slate-200 dark:hover:bg-slate-800"
      >
        <Search size={20} />
      </button>

      <Dialog open={open} onClose={setOpen} className="relative z-[280]">
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-slate-950/55 backdrop-blur-sm transition duration-200 data-closed:opacity-0"
        />
        <div className="fixed inset-0 overflow-y-auto p-3 pt-[10vh] sm:p-6 sm:pt-[14vh]">
          <DialogPanel
            transition
            className="mx-auto w-full max-w-xl overflow-hidden rounded-3xl border border-slate-200 bg-[#f7f4ea] shadow-2xl transition duration-200 data-closed:translate-y-2 data-closed:opacity-0 dark:border-slate-700 dark:bg-slate-950"
          >
            <DialogTitle className="sr-only">Search the Big Walk Field Guide</DialogTitle>
            <div className="flex items-center gap-3 border-b border-slate-200 p-3 dark:border-slate-800">
              <Search className="ml-1 shrink-0 text-slate-400" size={20} />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search puzzles and help…"
                aria-label="Search the guide"
                className="min-w-0 flex-1 border-0 bg-transparent px-0 py-2 text-base shadow-none outline-none placeholder:text-slate-400 focus:ring-0 dark:text-white"
              />
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close search"
                className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-slate-500 hover:bg-white dark:hover:bg-slate-800"
              >
                <X size={20} />
              </button>
            </div>

            <div className="max-h-[60vh] overflow-y-auto p-2">
              {!query && !loading && documents.length > 0 && (
                <p className="px-3 pt-2 pb-1 text-[11px] font-black tracking-[0.16em] text-slate-400 uppercase">
                  Quick links
                </p>
              )}
              {loading && <p className="p-6 text-center text-sm text-slate-500">Loading search…</p>}
              {!loading && results.length === 0 && (
                <p className="p-6 text-center text-sm text-slate-500">
                  No matching guide found. Try a visible object, number or platform.
                </p>
              )}
              {!loading &&
                results.map((document) => (
                  <Link
                    key={document.path}
                    href={`/${document.path}`}
                    onClick={() => {
                      setOpen(false)
                      setQuery('')
                    }}
                    className="group flex items-start justify-between gap-4 rounded-2xl px-3 py-3 transition hover:bg-white dark:hover:bg-slate-900"
                  >
                    <span className="min-w-0">
                      <span className="block font-bold text-slate-900 dark:text-white">
                        {document.title}
                      </span>
                      {document.summary && (
                        <span className="mt-1 line-clamp-2 block text-sm leading-5 text-slate-500 dark:text-slate-400">
                          {document.summary}
                        </span>
                      )}
                    </span>
                    <ArrowRight
                      size={17}
                      className="mt-1 shrink-0 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-[#1f6b5b]"
                    />
                  </Link>
                ))}
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  )
}
