import 'css/prism.css'
import { components } from '@/components/MDXComponents'
import { MDXLayoutRenderer } from 'pliny/mdx-components'
import { coreContent } from 'pliny/utils/contentlayer'
import { allBlogs } from 'contentlayer/generated'
import type { Blog } from 'contentlayer/generated'
import GuideLayout from '@/layouts/GuideLayout'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import siteMetadata from '@/data/siteMetadata'
import { getCategorySlug } from '@/data/guideCategories'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>
}): Promise<Metadata | undefined> {
  const { slug } = await params
  const value = decodeURI(slug.join('/'))
  const post = allBlogs.find((item) => item.slug === value)
  if (!post) return
  const canonical = `${siteMetadata.siteUrl}/${value}/`
  const image = post.images?.[0] || siteMetadata.socialBanner
  const summary = post.summary || post.title
  const description =
    (summary.startsWith('A direct, source-checked') ||
      summary.startsWith('Where to find every major')) &&
    post.quickAnswer
      ? post.quickAnswer
      : summary
  return {
    title: post.title,
    description,
    alternates: { canonical },
    openGraph: {
      type: 'article',
      title: post.title,
      description,
      url: canonical,
      images: [image],
      publishedTime: post.date,
      modifiedTime: post.lastmod || post.date,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description,
      images: [image],
    },
  }
}

export const generateStaticParams = async () =>
  allBlogs.map((item) => ({ slug: item.slug.split('/') }))

export default async function GuidePage({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params
  const value = decodeURI(slug.join('/'))
  const post = allBlogs.find((item) => item.slug === value) as Blog | undefined
  if (!post) return notFound()
  const content = coreContent(post)
  const categorySlug = getCategorySlug(post.category)
  const categoryUrl =
    post.category === 'Puzzle'
      ? `${siteMetadata.siteUrl}/puzzles/`
      : categorySlug
        ? `${siteMetadata.siteUrl}/topics/${categorySlug}/`
        : `${siteMetadata.siteUrl}/guides/`
  const breadcrumbs = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: `${siteMetadata.siteUrl}/`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: post.category,
        item: categoryUrl,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: post.title,
        item: `${siteMetadata.siteUrl}/${post.slug}/`,
      },
    ],
  }
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(post.structuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />
      <GuideLayout content={content}>
        <MDXLayoutRenderer code={post.body.code} components={components} toc={post.toc} />
      </GuideLayout>
    </>
  )
}
