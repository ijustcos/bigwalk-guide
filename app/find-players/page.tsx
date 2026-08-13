import FindPlayersBoard from '@/components/FindPlayersBoard'
import { genPageMetadata } from '@/app/seo'

export const metadata = genPageMetadata({
  title: 'Find Big Walk Players',
  description:
    'Find a Big Walk group by platform, region, language and play style. Post without creating an account.',
})

export default function FindPlayersPage() {
  return (
    <div className="pt-10 pb-12">
      <div className="max-w-3xl">
        <span className="rounded-full bg-[#dbeadf] px-3 py-1 text-xs font-bold tracking-wider text-[#1f6b5b] uppercase">
          Live LFG
        </span>
        <h1 className="mt-5 text-4xl font-black tracking-[-0.04em] sm:text-6xl">
          Find Big Walk players
        </h1>
        <p className="mt-5 text-lg leading-8 text-slate-600 dark:text-slate-300">
          Big Walk has no random matchmaking. Browse active groups or post your own in under a
          minute—no registration required.
        </p>
      </div>
      <div className="mt-9">
        <FindPlayersBoard />
      </div>
      <section className="mt-14 grid gap-5 border-t border-slate-200 pt-10 md:grid-cols-3 dark:border-slate-800">
        <div>
          <h2 className="font-black">Short-lived by design</h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            Every listing expires after 2, 6 or 24 hours, so stale Join Codes do not pile up.
          </p>
        </div>
        <div>
          <h2 className="font-black">Protect your privacy</h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            Use a nickname. Never post your real name, phone number, address or other personal
            details.
          </p>
        </div>
        <div>
          <h2 className="font-black">Host keeps progress</h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            For continuing groups, agree who will host—the host owns the saved session progress.
          </p>
        </div>
      </section>
    </div>
  )
}
