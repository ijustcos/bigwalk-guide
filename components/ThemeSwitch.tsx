'use client'

import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { Check } from 'lucide-react'

const Sun = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    className="h-5 w-5"
  >
    <path
      fillRule="evenodd"
      d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
      clipRule="evenodd"
    />
  </svg>
)
const Moon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    className="h-5 w-5"
  >
    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
  </svg>
)
const Monitor = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-5 w-5"
  >
    <rect x="3" y="3" width="14" height="10" rx="2" ry="2"></rect>
    <line x1="7" y1="17" x2="13" y2="17"></line>
    <line x1="10" y1="13" x2="10" y2="17"></line>
  </svg>
)
const Blank = () => <span className="block h-5 w-5" />

const options = [
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'dark', label: 'Dark', icon: Moon },
  { value: 'system', label: 'System', icon: Monitor },
] as const

const ThemeSwitch = () => {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme, resolvedTheme } = useTheme()

  // When mounted on client, now we can show the UI
  useEffect(() => setMounted(true), [])

  return (
    <Menu as="div" className="relative shrink-0 text-left">
      <MenuButton
        aria-label="Choose color theme"
        className="grid h-11 w-11 place-items-center rounded-full text-slate-700 transition hover:bg-white hover:text-[#1f6b5b] dark:text-slate-200 dark:hover:bg-slate-800"
      >
        {mounted ? resolvedTheme === 'dark' ? <Moon /> : <Sun /> : <Blank />}
      </MenuButton>
      <MenuItems
        anchor="bottom end"
        portal
        className="z-[300] mt-2 w-40 rounded-2xl border border-slate-200 bg-white p-1.5 text-slate-800 shadow-2xl shadow-slate-950/15 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
      >
        {options.map(({ value, label, icon: Icon }) => (
          <MenuItem key={value}>
            {({ focus }) => (
              <button
                type="button"
                onClick={() => setTheme(value)}
                className={`flex min-h-11 w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold transition ${
                  focus ? 'bg-[#edf4ee] text-[#153f38] dark:bg-slate-800 dark:text-white' : ''
                }`}
              >
                <Icon />
                <span className="flex-1 text-left">{label}</span>
                {theme === value && <Check size={16} aria-hidden />}
              </button>
            )}
          </MenuItem>
        ))}
      </MenuItems>
    </Menu>
  )
}

export default ThemeSwitch
