import { genPageMetadata } from '@/app/seo'
export const metadata = genPageMetadata({ title: 'Privacy Policy' })
export default function Page() {
  return (
    <article className="prose prose-slate dark:prose-invert mx-auto py-12">
      <h1>Privacy Policy</h1>
      <p>
        Big Walk Field Guide is designed to collect as little personal information as possible. You
        do not need an account to read guides or post a group listing.
      </p>
      <h2>Find Players data</h2>
      <p>
        Listings contain the nickname, platform, region, language, play preferences, optional
        message and Join Code that you submit. Listings expire automatically. A one-way hash derived
        from the network source may be retained for rate limiting and abuse prevention; the public
        site never displays it.
      </p>
      <h2>Do not submit personal information</h2>
      <p>
        Do not publish real names, phone numbers, addresses, precise locations, private account
        credentials or other sensitive information.
      </p>
      <h2>Analytics and security</h2>
      <p>
        The site may use privacy-conscious traffic analytics and Cloudflare Turnstile to prevent
        automated abuse. These providers may process limited technical data according to their own
        policies.
      </p>
      <h2>Removal</h2>
      <p>
        Use the private management link to remove your listing, or report a listing that exposes
        personal information. Moderators can hide or delete content.
      </p>
      <p>Last updated: August 13, 2026.</p>
    </article>
  )
}
