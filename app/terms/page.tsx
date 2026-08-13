import { genPageMetadata } from '@/app/seo'
export const metadata = genPageMetadata({ title: 'Terms and Community Rules' })
export default function Page() {
  return (
    <article className="prose prose-slate dark:prose-invert mx-auto py-12">
      <h1>Terms and Community Rules</h1>
      <p>
        This is an unofficial community-made Big Walk guide. It is not affiliated with House House
        or Panic.
      </p>
      <h2>Posting rules</h2>
      <ul>
        <li>Use Find Players only to arrange Big Walk sessions.</li>
        <li>Do not post harassment, hate, sexual content, spam, advertising or unsafe links.</li>
        <li>Do not share personal or sensitive information.</li>
        <li>Do not impersonate another player or publish misleading Join Codes.</li>
      </ul>
      <h2>Moderation</h2>
      <p>
        Listings may be hidden, expired or deleted without notice when they break these rules,
        receive credible reports or threaten player safety. Automated limits may restrict repeated
        posting.
      </p>
      <h2>Safety</h2>
      <p>
        You choose whether to join another player's game. Use platform safety controls, block
        abusive users and avoid sharing information beyond what is needed to play.
      </p>
      <p>Last updated: August 13, 2026.</p>
    </article>
  )
}
