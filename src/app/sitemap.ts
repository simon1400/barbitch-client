import type { MetadataRoute } from 'next'
const domain = process.env.APP_DOMAIN

const sitemapStatic = [
  {
    url: '',
    priority: 1,
  },
  {
    url: '/manikura',
    priority: 0.9,
  },
  {
    url: '/rasy',
    priority: 0.9,
  },
  {
    url: '/oboci',
    priority: 0.9,
  },
  {
    url: '/kontakt',
    priority: 0.8,
  },
  {
    url: '/bitchcard-2025',
    priority: 0.8,
  },
  {
    url: '/cenik',
    priority: 0.8,
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
