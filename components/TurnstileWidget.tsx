'use client'

import Script from 'next/script'
import { useEffect, useRef, useState } from 'react'

declare global {
  interface Window {
    turnstile?: {
      render: (
        element: HTMLElement,
        options: {
          sitekey: string
          action: string
          theme: 'auto'
          size: 'flexible'
          callback: (token: string) => void
          'expired-callback': () => void
          'error-callback': () => void
        }
      ) => string
      remove: (widgetId: string) => void
    }
  }
}

type TurnstileWidgetProps = {
  action: 'lfg_post' | 'admin_login'
  onToken: (token: string) => void
  resetSignal?: number
}

export default function TurnstileWidget({
  action,
  onToken,
  resetSignal = 0,
}: TurnstileWidgetProps) {
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY
  const containerRef = useRef<HTMLDivElement>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (!siteKey || !ready || !window.turnstile || !containerRef.current) return
    onToken('')
    const widgetId = window.turnstile.render(containerRef.current, {
      sitekey: siteKey,
      action,
      theme: 'auto',
      size: 'flexible',
      callback: onToken,
      'expired-callback': () => onToken(''),
      'error-callback': () => onToken(''),
    })
    return () => window.turnstile?.remove(widgetId)
  }, [action, onToken, ready, resetSignal, siteKey])

  if (!siteKey)
    return (
      <p className="rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-900 dark:bg-amber-950/50 dark:text-amber-200">
        Posting is temporarily unavailable while security verification is being configured.
      </p>
    )

  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        strategy="afterInteractive"
        onLoad={() => setReady(true)}
        onReady={() => setReady(true)}
      />
      <div className="min-h-16 min-w-0 overflow-hidden" ref={containerRef} />
    </>
  )
}
