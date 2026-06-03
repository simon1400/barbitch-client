import { getSitemapSlugs } from 'fetch/sitemap'
import { HIRING } from 'lib/hiring'
import { NextResponse } from 'next/server'

export async function GET() {
  const baseUrl = 'https://barbitch.cz'

  const routes = await getSitemapSlugs()

  // lastmod statických stránek odvozujeme z nejnovější změny CMS obsahu —
  // ne z času buildu (ten by Googlu lhal „změněno“ při každém nasazení).
  const contentDates = routes
    .map((r) => new Date(r.update).getTime())
    .filter((t) => !Number.isNaN(t))
  const lastModified = (
    contentDates.length > 0 ? new Date(Math.max(...contentDates)) : new Date()
  ).toISOString()

  const staticRoutes = [
    { update: lastModified, slug: ``, priority: '1.0', changefreq: 'weekly' },
    { update: lastModified, slug: '/blog', priority: '0.9', changefreq: 'weekly' },
    { update: lastModified, slug: '/darkovy-voucher', priority: '0.8', changefreq: 'monthly' },
    { update: lastModified, slug: '/kontakt', priority: '0.8', changefreq: 'monthly' },
    { update: lastModified, slug: '/cenik', priority: '0.8', changefreq: 'monthly' },
    { update: lastModified, slug: '/book', priority: '0.8', changefreq: 'monthly' },
    // Inzerát na pozici — jen když běží nábor (HIRING.enabled).
    ...(HIRING.enabled
      ? [{ update: lastModified, slug: '/kariera', priority: '0.7', changefreq: 'weekly' }]
      : []),
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
