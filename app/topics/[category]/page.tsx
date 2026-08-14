import Image from 'next/image'
import Link from '@/components/Link'
import { allBlogs } from 'contentlayer/generated'
import { notFound } from 'next/navigation'
import { ArrowRight } from 'lucide-react'
import { guideCategories } from '@/data/guideCategories'

export const generateStaticParams = () =>
  guideCategories.map((category) => ({ category: category.slug }))

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }) {
  const { category: slug } = await params
  const category = guideCategories.find((item) => item.slug === slug)
  if (!category) return
  return {
    title: `Big Walk ${category.label} Guides`,
    description: category.description,
    alternates: { canonical: `/topics/${category.slug}` },
  }
}

export default async function TopicPage({ params }: { params: Promise<{ category: string }> }) {
  const { category: slug } = await params
  const category = guideCategories.find((item) => item.slug === slug)
  if (!category) return notFound()
  const posts = allBlogs.filter((post) => post.category === category.label && !post.draft)

  return (
    <div className="pt-10 pb-14">
      <nav
        className="mb-6 text-sm font-semibold text-slate-500 dark:text-slate-300"
        aria-label="Breadcrumb"
      >
        <Link href="/guides">All guides</Link> <span className="mx-2">/</span> {category.label}
      </nav>
      <header className="relative overflow-hidden rounded-3xl bg-[#153f38] px-6 py-12 text-white sm:px-10">
        <Image
          src={category.image}
          alt="Big Walk official gameplay"
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-25"
        />
        <div className="relative max-w-3xl">
          <p className="text-xs font-bold tracking-[0.18em] text-[#f8d77d] uppercase">
            {posts.length} source-checked pages
          </p>
          <h1 className="mt-2 text-4xl font-black tracking-[-0.04em] sm:text-6xl">
            Big Walk {category.label}
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-white/80">{category.description}</p>
        </div>
      </header>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/${post.slug}`}
            className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="relative h-36 overflow-hidden bg-slate-200">
              <Image
                src={post.images?.[0] || category.image}
                alt={`${post.title} Big Walk guide`}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition duration-500 group-hover:scale-105"
              />
            </div>
            <div className="p-5">
              <h2 className="leading-6 font-black group-hover:text-[#1f6b5b]">{post.title}</h2>
              <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-500 dark:text-slate-400">
                {post.summary}
              </p>
              <span className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-[#1f6b5b] dark:text-emerald-300">
                Read answer <ArrowRight size={14} />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
