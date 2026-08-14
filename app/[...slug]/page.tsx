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
  return {
    title: post.title,
    description: post.summary,
    alternates: { canonical },
    openGraph: {
      type: 'article',
      title: post.title,
      description: post.summary,
      url: canonical,
      images: [image],
      publishedTime: post.date,
      modifiedTime: post.lastmod || post.date,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.summary,
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
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(post.structuredData) }}
      />
      <GuideLayout content={content}>
        <MDXLayoutRenderer code={post.body.code} components={components} toc={post.toc} />
      </GuideLayout>
    </>
  )
}
