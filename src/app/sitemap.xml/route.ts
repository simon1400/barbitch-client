import { getSitemapSlugs } from 'fetch/sitemap'
import { NextResponse } from 'next/server'

export async function GET() {
  const baseUrl = 'https://barbitch.cz'

  const routes = await getSitemapSlugs()

  const staticRoutes = [
    { update: '2025-05-17T20:30:30.002Z', slug: ``, priority: '1.0', changefreq: 'weekly' },
    { update: '2025-05-17T20:30:30.002Z', slug: '/blog', priority: '0.9', changefreq: 'weekly' },
    {
      update: '2025-05-17T20:30:30.002Z',
      slug: '/kontakt',
      priority: '0.8',
      changefreq: 'monthly',
    },
    { update: '2025-05-17T20:30:30.002Z', slug: '/cenik', priority: '0.8', changefreq: 'monthly' },
    { update: '2025-05-17T20:30:30.002Z', slug: '/book', priority: '0.8', changefreq: 'monthly' },
  ]

  const allRoutes = [...staticRoutes, ...routes]

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${allRoutes
    .map(
      (route) => `
    <url>
      <loc>${baseUrl}${route.slug}</loc>
      <lastmod>${route.update}</lastmod>
      <changefreq>${route.changefreq}</changefreq>
      <priority>${route.priority}</priority>
    </url>`,
    )
    .join('')}
</urlset>`

  return new NextResponse(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
    },
  })
}
