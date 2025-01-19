import type { MetadataRoute } from 'next'
const domain = process.env.APP_DOMAIN

const sitemapStatic = [
  {
    url: '',
    priority: 1,
  },
  {
    url: '/manikura',
    priority: 1,
  },
  {
    url: '/rasy',
    priority: 1,
  },
  {
    url: '/oboci',
    priority: 1,
  },
  {
    url: '/kontakt',
    priority: 1,
  },
  {
    url: '/cenik',
    priority: 1,
  },
]

export default function sitemap(): MetadataRoute.Sitemap {
  const frequency:
    | 'weekly'
    | 'always'
    | 'hourly'
    | 'daily'
    | 'monthly'
    | 'yearly'
    | 'never'
    | undefined = 'weekly'
  const sitemapData: MetadataRoute.Sitemap = [
    ...sitemapStatic.map((item) => ({
      url: `${domain}${item.url}`,
      lastModified: new Date(),
      changeFrequency: frequency,
      priority: item.priority,
    })),
    ...sitemapStatic.map((item) => ({
      url: `${domain}/ru${item.url}`,
      lastModified: new Date(),
      changeFrequency: frequency,
      priority: item.priority,
    })),
  ]
  return sitemapData
}
