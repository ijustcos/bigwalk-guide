import { MetadataRoute } from 'next'
import { allBlogs } from 'contentlayer/generated'
import siteMetadata from '@/data/siteMetadata'
import { guideCategories } from '@/data/guideCategories'

export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = siteMetadata.siteUrl

  const blogRoutes = allBlogs
    .filter((post) => !post.draft)
    .map((post) => ({
      url: `${siteUrl}/${post.slug}/`,
      lastModified: post.lastmod || post.date,
    }))

  const routes = ['', 'puzzles', 'guides', 'find-players', 'privacy', 'terms'].map((route) => {
    const path = route ? `/${route}/` : '/'
    return {
      url: `${siteUrl}${path}`,
      lastModified: new Date().toISOString().split('T')[0],
    }
  })

  const topicRoutes = guideCategories.map((category) => ({
    url: `${siteUrl}/topics/${category.slug}/`,
    lastModified: new Date().toISOString().split('T')[0],
  }))

  return [...routes, ...topicRoutes, ...blogRoutes]
}
