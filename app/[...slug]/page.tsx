import 'css/prism.css'
import { components } from '@/components/MDXComponents'
import { MDXLayoutRenderer } from 'pliny/mdx-components'
import { coreContent } from 'pliny/utils/contentlayer'
import { allBlogs } from 'contentlayer/generated'
import type { Blog } from 'contentlayer/generated'
import GuideLayout from '@/layouts/GuideLayout'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>
}): Promise<Metadata | undefined> {
  const { slug } = await params
  const value = decodeURI(slug.join('/'))
  const post = allBlogs.find((item) => item.slug === value)
  if (!post) return
  return { title: post.title, description: post.summary, alternates: { canonical: `/${value}` } }
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
