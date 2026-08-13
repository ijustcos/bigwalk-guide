import Link from '@/components/Link'
import { allBlogs } from 'contentlayer/generated'
import { ArrowRight, Search } from 'lucide-react'
import { genPageMetadata } from '@/app/seo'

export const metadata = genPageMetadata({
  title: 'Big Walk Puzzle Solutions',
  description:
    'Identify Big Walk puzzles by screenshots, visible features, player nicknames and location. Reveal hints without spoiling the full solution.',
})

const colors = [
  'bg-[#f5c24d] text-[#153f38]',
  'bg-[#8763a8] text-white',
  'bg-[#80abc4] text-[#102e3a]',
  'bg-[#dc6d4f] text-white',
  'bg-[#557c65] text-white',
]
export default function PuzzlesPage() {
  const puzzles = allBlogs.filter((post) => post.category === 'Puzzle')
  return (
    <div className="pt-10 pb-12">
      <div className="max-w-3xl">
        <span className="inline-flex items-center gap-2 rounded-full bg-[#dbeadf] px-3 py-1 text-xs font-bold tracking-wider text-[#1f6b5b] uppercase">
          <Search size={14} /> Visual puzzle finder
        </span>
        <h1 className="mt-5 text-4xl font-black tracking-[-0.04em] sm:text-6xl">
          Find the puzzle in front of you
        </h1>
        <p className="mt-5 text-lg leading-8 text-slate-600 dark:text-slate-300">
          Big Walk rarely names its puzzles. Start with what you can see, then reveal one hint at a
          time.
        </p>
      </div>
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {puzzles.map((post, index) => (
          <Link
            key={post.slug}
            href={`/${post.slug}`}
            className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900"
          >
            <div
              className={`grid h-32 place-items-center px-6 text-center text-2xl font-black ${colors[index % colors.length]}`}
            >
              {post.aliases?.[0] || 'Puzzle'}
            </div>
            <div className="p-5">
              <h2 className="leading-6 font-black group-hover:text-[#1f6b5b]">{post.title}</h2>
              <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">{post.summary}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-[#1f6b5b]">
                Hints and solution <ArrowRight size={14} />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
