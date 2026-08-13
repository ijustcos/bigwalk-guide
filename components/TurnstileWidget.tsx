'use client'

import Script from 'next/script'
import { useEffect, useState } from 'react'

declare global {
  interface Window {
    onBigWalkTurnstile?: (token: string) => void
  }
}

export default function TurnstileWidget({ onToken }: { onToken: (token: string) => void }) {
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY
  const [ready, setReady] = useState(false)
  useEffect(() => {
    window.onBigWalkTurnstile = onToken
    return () => {
      delete window.onBigWalkTurnstile
    }
  }, [onToken])
  if (!siteKey)
    return (
      <p className="text-xs text-slate-500">
        Security verification will be enabled on the live domain.
      </p>
    )
  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js"
        strategy="afterInteractive"
        onLoad={() => setReady(true)}
      />
      <div className="min-h-16">
        {ready && (
          <div
            className="cf-turnstile"
            data-sitekey={siteKey}
            data-callback="onBigWalkTurnstile"
            data-theme="auto"
          />
        )}
      </div>
    </>
  )
}
