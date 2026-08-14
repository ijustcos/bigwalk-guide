import Image from 'next/image'
import Link from '@/components/Link'
import { allBlogs } from 'contentlayer/generated'
import { ArrowRight, BookOpen } from 'lucide-react'
import { genPageMetadata } from '@/app/seo'
import { guideCategories } from '@/data/guideCategories'

export const metadata = genPageMetadata({
  title: 'Big Walk Guides, Towers, Tools and Multiplayer Help',
  description:
    'Browse more than 100 source-checked Big Walk answers, organized by player need: beginner help, puzzles, locations, tools, multiplayer, progression, trophies and fixes.',
})

export default function GuidesPage() {
  const guides = allBlogs.filter((post) => post.category !== 'Puzzle' && !post.draft)
  const groups = guideCategories
    .map((category) => ({
      ...category,
      posts: guides.filter((post) => post.category === category.label),
    }))
    .filter((group) => group.posts.length > 0)

  return (
    <div className="pt-10 pb-14">
      <section className="relative overflow-hidden rounded-3xl bg-[#153f38] px-6 py-10 text-white sm:px-10 sm:py-14">
        <div className="relative z-10 max-w-3xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-bold tracking-wider text-[#f8d77d] uppercase">
            <BookOpen size={14} /> {guides.length} source-checked answers
          </span>
          <h1 className="mt-5 text-4xl font-black tracking-[-0.04em] sm:text-6xl">
            Find the exact help you need
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-emerald-50/80">
            Every page starts with a direct answer. Browse by task, then use the related links to
            move naturally from a location to its puzzle, reward and next objective.
          </p>
        </div>
        <Image
          src="/static/images/big-walk/official-03.jpg"
          alt="Big Walk players exploring the island together"
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-20 mix-blend-luminosity"
        />
      </section>

      <section className="py-10">
        <h2 className="sr-only">Browse Big Walk guides by category</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {groups.map((group) => (
            <Link
              key={group.slug}
              href={`/topics/${group.slug}`}
              className="group relative min-h-48 overflow-hidden rounded-2xl bg-slate-900 p-5 text-white shadow-sm"
            >
              <Image
                src={group.image}
                alt="Big Walk official gameplay"
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover opacity-45 transition duration-500 group-hover:scale-105 group-hover:opacity-55"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
              <div className="relative flex h-full flex-col justify-end">
                <span className="text-xs font-bold tracking-wider text-[#f8d77d] uppercase">
                  {group.posts.length} guides
                </span>
                <h3 className="mt-1 text-2xl font-black">{group.label}</h3>
                <p className="mt-2 text-sm leading-5 text-white/75">{group.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {groups.map((group) => (
        <section
          key={group.label}
          className="border-t border-slate-200 py-12 dark:border-slate-800"
        >
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold tracking-[0.18em] text-[#1f6b5b] uppercase">
                Browse by need
              </p>
              <h2 className="mt-1 text-2xl font-black tracking-tight sm:text-3xl">{group.label}</h2>
            </div>
            <Link
              href={`/topics/${group.slug}`}
              className="inline-flex items-center gap-1 text-sm font-bold text-[#1f6b5b]"
            >
              All {group.posts.length} <ArrowRight size={15} />
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {group.posts.slice(0, 6).map((post) => (
              <Link
                key={post.slug}
                href={`/${post.slug}`}
                className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900"
              >
                {post.images?.[0] && (
                  <div className="relative h-32 overflow-hidden bg-slate-200">
                    <Image
                      src={post.images[0]}
                      alt="Big Walk gameplay"
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition duration-500 group-hover:scale-105"
                    />
                  </div>
                )}
                <div className="p-5">
                  <h3 className="leading-6 font-black group-hover:text-[#1f6b5b]">{post.title}</h3>
                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                    {post.summary}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-[#1f6b5b]">
                    Read answer <ArrowRight size={14} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
