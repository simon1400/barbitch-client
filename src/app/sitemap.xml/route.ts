import { getSingletonDates, getSitemapSlugs } from 'fetch/sitemap'
import { HIRING } from 'lib/hiring'
import { SITE_URL } from 'lib/seo'
import { NextResponse } from 'next/server'

// Každý průchod bota jinak znamenal 3+ dotazy do Strapi.
export const revalidate = 3600

/** `<loc>` je XML — `&` v ad-parametru nebo slugu by jinak rozbil celý dokument. */
const esc = (value: string): string =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;')

export async function GET() {
  const [routes, singletons] = await Promise.all([getSitemapSlugs(), getSingletonDates()])

  // Záloha pro stránky, jejichž zdroj v CMS se nepodařilo načíst: nejnovější
  // změna napříč obsahem. Čas buildu by Googlu lhal „změněno“ při každém nasazení.
  const contentDates = routes
    .map((r) => new Date(r.update).getTime())
    .filter((t) => !Number.isNaN(t))
  const fallbackDate = (
    contentDates.length > 0 ? new Date(Math.max(...contentDates)) : new Date()
  ).toISOString()

  const at = (value: string | undefined) => value || fallbackDate

  const staticRoutes = [
    { update: at(singletons.homepage), slug: ``, priority: '1.0', changefreq: 'weekly' },
    { update: fallbackDate, slug: '/blog', priority: '0.9', changefreq: 'weekly' },
    {
      update: at(singletons.voucher),
      slug: '/darkovy-voucher',
      priority: '0.8',
      changefreq: 'monthly',
    },
    { update: at(singletons.contact), slug: '/kontakt', priority: '0.8', changefreq: 'monthly' },
    { update: at(singletons.pricelist), slug: '/cenik', priority: '0.8', changefreq: 'monthly' },
    { update: fallbackDate, slug: '/book', priority: '0.8', changefreq: 'monthly' },
    // Inzerát na pozici — jen když běží nábor (HIRING.enabled).
    ...(HIRING.enabled
      ? [{ update: fallbackDate, slug: '/kariera', priority: '0.7', changefreq: 'weekly' }]
      : []),
  ]

  const allRoutes = [...staticRoutes, ...routes]

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${allRoutes
    .map(
      (route) => `
    <url>
      <loc>${esc(`${SITE_URL}${route.slug}`)}</loc>
      <lastmod>${esc(route.update)}</lastmod>
      <changefreq>${route.changefreq}</changefreq>
      <priority>${route.priority}</priority>
    </url>`,
    )
    .join('')}
</urlset>`

  return new NextResponse(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400',
    },
  })
}
