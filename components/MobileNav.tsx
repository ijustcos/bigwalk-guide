'use client'

import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import { useState } from 'react'
import { X } from 'lucide-react'
import Link from './Link'
import headerNavLinks from '@/data/headerNavLinks'

const MobileNav = () => {
  const [navShow, setNavShow] = useState(false)

  return (
    <>
      <button
        type="button"
        aria-label="Open navigation menu"
        onClick={() => setNavShow(true)}
        className="grid h-11 w-11 shrink-0 place-items-center rounded-full text-slate-700 transition hover:bg-white hover:text-[#1f6b5b] md:hidden dark:text-slate-200 dark:hover:bg-slate-800"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="h-6 w-6"
        >
          <path
            fillRule="evenodd"
            d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
            clipRule="evenodd"
          />
        </svg>
      </button>
      <Dialog open={navShow} onClose={setNavShow} className="relative z-[250] md:hidden">
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-slate-950/45 backdrop-blur-sm transition duration-200 data-closed:opacity-0"
        />
        <div className="fixed inset-0 flex justify-end">
          <DialogPanel
            transition
            className="h-full w-[86vw] max-w-sm overflow-y-auto border-l border-slate-200 bg-[#f7f4ea] p-6 shadow-2xl transition duration-300 ease-out data-closed:translate-x-full dark:border-slate-800 dark:bg-[#0e1716]"
          >
            <div className="flex items-center justify-between border-b border-slate-200 pb-5 dark:border-slate-800">
              <DialogTitle className="text-sm font-black tracking-[0.16em] text-[#1f6b5b] uppercase dark:text-emerald-300">
                Navigate
              </DialogTitle>
              <button
                type="button"
                className="grid h-11 w-11 place-items-center rounded-full text-slate-700 hover:bg-white dark:text-slate-200 dark:hover:bg-slate-800"
                aria-label="Close navigation menu"
                onClick={() => setNavShow(false)}
              >
                <X size={24} />
              </button>
            </div>
            <nav className="mt-6 flex flex-col gap-2" aria-label="Mobile navigation">
              {headerNavLinks.map((link) => (
                <Link
                  key={link.title}
                  href={link.href}
                  className={`rounded-2xl px-4 py-3.5 text-xl font-black tracking-tight transition hover:bg-white hover:text-[#153f38] dark:hover:bg-slate-800 dark:hover:text-white ${
                    link.href === '/find-players'
                      ? 'mt-3 bg-[#f5c24d] text-[#153f38] hover:bg-[#ffd66c]'
                      : 'text-slate-900 dark:text-slate-100'
                  }`}
                  onClick={() => setNavShow(false)}
                >
                  {link.title}
                </Link>
              ))}
            </nav>
            <p className="mt-10 border-t border-slate-200 pt-6 text-sm leading-6 text-slate-500 dark:border-slate-800 dark:text-slate-400">
              Fast puzzle answers, multiplayer help and fresh groups for Big Walk.
            </p>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  )
}

export default MobileNav
