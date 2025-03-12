import type { MetadataRoute } from 'next'
const domain = process.env.APP_DOMAIN

const sitemapStatic = [
  {
    url: '',
    priority: 1,
  },
  {
    url: '/blog',
    priority: 0.9,
  },
  {
    url: '/kontakt',
    priority: 0.9,
  },
  {
    url: '/bitchcard-2025',
    priority: 0.9,
  },
  {
    url: '/cenik',
    priority: 0.9,
  },
  {
    url: '/service/manikura',
    priority: 0.8,
  },
  {
    url: '/service/rasy',
    priority: 0.8,
  },
  {
    url: '/service/oboci',
    priority: 0.8,
  },
  {
    url: '/blog/nasivani-ras-typy-efekty-a-pece-po-procedure',
    priority: 0.7,
  },
  {
    url: '/blog/luxusni-manikura-v-brne-trendy-roku-2025',
    priority: 0.7,
  },
  {
    url: '/blog/co-je-laminace-oboci',
    priority: 0.7,
  },
  {
    url: '/blog/jak-spravne-pecovat-o-nehty-v-domacim-prostredi',
    priority: 0.7,
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
    // ...sitemapStatic.map((item) => ({
    //   url: `${domain}/ru${item.url}`,
    //   lastModified: new Date(),
    //   changeFrequency: frequency,
    //   priority: item.priority,
    // })),
  ]
  return sitemapData
}
