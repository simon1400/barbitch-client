import { getSitemapSlugs } from 'fetch/sitemap'
import { NextResponse } from 'next/server'

export async function GET() {
  const baseUrl = 'https://barbitch.cz'

  const routes = await getSitemapSlugs()

  const now = new Date().toISOString()

  const staticRoutes = [
    { update: now, slug: ``, priority: '1.0', changefreq: 'weekly' },
    { update: now, slug: '/blog', priority: '0.9', changefreq: 'weekly' },
    { update: now, slug: '/darkovy-voucher', priority: '0.8', changefreq: 'monthly' },
    { update: now, slug: '/kontakt', priority: '0.8', changefreq: 'monthly' },
    { update: now, slug: '/cenik', priority: '0.8', changefreq: 'monthly' },
    { update: now, slug: '/book', priority: '0.8', changefreq: 'monthly' },
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
