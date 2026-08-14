import Main from './Main'
import siteMetadata from '@/data/siteMetadata'

export default async function Page() {
  const websiteData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${siteMetadata.siteUrl}/#website`,
    url: `${siteMetadata.siteUrl}/`,
    name: 'Big Walk Field Guide',
    alternateName: ['Big Walk Hub', 'BigWalkHub'],
    description: siteMetadata.description,
    inLanguage: 'en-US',
    publisher: {
      '@id': `${siteMetadata.siteUrl}/#organization`,
    },
  }
  const organizationData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${siteMetadata.siteUrl}/#organization`,
    name: 'Big Walk Field Guide',
    alternateName: 'Big Walk Hub',
    url: `${siteMetadata.siteUrl}/`,
    logo: `${siteMetadata.siteUrl}/static/images/logo.png`,
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationData) }}
      />
      <Main />
    </>
  )
}
