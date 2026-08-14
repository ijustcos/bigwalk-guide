import { ReactNode } from 'react'
import { CoreContent } from 'pliny/utils/contentlayer'
import type { Blog } from 'contentlayer/generated'
import Link from '@/components/Link'
import { CheckCircle2, Clock3, MapPin, Users } from 'lucide-react'
import GameImage from '@/components/GameImage'
import { getCategorySlug } from '@/data/guideCategories'

export default function GuideLayout({
  content,
  children,
}: {
  content: CoreContent<Blog>
  children: ReactNode
  authorDetails?: unknown
  next?: unknown
  prev?: unknown
}) {
  const {
    title,
    summary,
    category,
    quickAnswer,
    aliases,
    players,
    location,
    lastmod,
    date,
    verified,
    images,
  } = content
  const categorySlug = getCategorySlug(category)
  return (
    <article className="mx-auto max-w-4xl pt-9 pb-12">
      <nav
        className="mb-6 flex items-center gap-2 text-sm font-semibold text-slate-500 dark:text-slate-300"
        aria-label="Breadcrumb"
      >
        <Link href="/">Home</Link>
        <span>/</span>
        <Link
          href={
            category === 'Puzzle'
              ? '/puzzles'
              : categorySlug
                ? `/topics/${categorySlug}`
                : '/guides'
          }
        >
          {category}
        </Link>
      </nav>
      <header>
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-[#dbeadf] px-3 py-1 text-xs font-bold tracking-wider text-[#1f6b5b] uppercase dark:bg-emerald-950 dark:text-emerald-300">
            {category}
          </span>
          {verified && (
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 dark:text-slate-300">
              <CheckCircle2 size={14} /> Source checked
            </span>
          )}
        </div>
        <h1 className="mt-5 text-4xl font-black tracking-[-0.035em] text-slate-950 sm:text-5xl dark:text-white">
          {title}
        </h1>
        {summary && (
          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600 dark:text-slate-300">
            {summary}
          </p>
        )}
        <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-500 dark:text-slate-400">
          {players && (
            <span className="inline-flex items-center gap-1.5">
              <Users size={16} /> {players}
            </span>
          )}
          {location && (
            <span className="inline-flex items-center gap-1.5">
              <MapPin size={16} /> {location}
            </span>
          )}
          <span className="inline-flex items-center gap-1.5">
            <Clock3 size={16} /> Updated{' '}
            {new Date(lastmod || date).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </span>
        </div>
        {aliases && aliases.length > 0 && (
          <div className="mt-5 text-sm text-slate-500 dark:text-slate-400">
            <strong className="text-slate-700 dark:text-slate-200">Players also call this:</strong>{' '}
            {aliases.join(', ')}
          </div>
        )}
      </header>
      {images?.[0] && (
        <GameImage
          src={images[0]}
          alt={`${title} — official Big Walk game screenshot`}
          caption="Big Walk's open world is built around exploration, communication and shared discoveries."
          priority
        />
      )}
      {quickAnswer && (
        <aside className="my-8 rounded-2xl border-l-4 border-[#f5c24d] bg-white p-5 shadow-sm dark:bg-slate-900">
          <div className="text-xs font-black tracking-[0.16em] text-[#1f6b5b] uppercase dark:text-emerald-300">
            Quick answer
          </div>
          <p className="mt-2 leading-7 text-slate-700 dark:text-slate-200">{quickAnswer}</p>
        </aside>
      )}
      <div className="prose prose-slate dark:prose-invert prose-headings:scroll-mt-24 prose-headings:tracking-tight max-w-none">
        {children}
      </div>
      <footer className="mt-12 rounded-2xl bg-[#153f38] p-6 text-white">
        <h2 className="text-xl font-bold">Need another player?</h2>
        <p className="mt-2 text-sm leading-6 text-emerald-50/80">
          Big Walk has no random matchmaking. Post a short-lived listing without creating an
          account.
        </p>
        <Link
          href="/find-players"
          className="mt-4 inline-flex rounded-lg bg-[#f5c24d] px-4 py-2 text-sm font-bold text-[#153f38]"
        >
          Find teammates
        </Link>
      </footer>
    </article>
  )
}
