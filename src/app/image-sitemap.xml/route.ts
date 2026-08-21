import { getAllPost } from 'fetch/blog'
import { getStrapiImageUrl } from 'lib/image-utils'
import { absUrl, SITE_URL } from 'lib/seo'
import { NextResponse } from 'next/server'

export const revalidate = 3600

const esc = (value: string): string =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;')

/**
 * Obrázková mapa webu pro Google Images.
 *
 * Zdrojem jsou náhledy článků — galerie služeb a hlavní stránky sedí
 * v dynamické zóně a nemají zatím vlastní fetch s `alternativeText`.
 * Až se doplní alt texty (viz SEO_AUDIT §5.5), stojí za to je přidat sem.
 */
export async function GET() {
  const posts = await getAllPost()

  const entries = posts
    .map((post) => ({
      page: `${SITE_URL}/blog/${post.slug}`,
      image: absUrl(getStrapiImageUrl(post.image?.url)),
      caption: post.image?.alternativeText || post.title.replaceAll(';sp;', ' '),
    }))
    .filter((entry) => !!entry.image)

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  ${entries
    .map(
      (entry) => `
    <url>
      <loc>${esc(entry.page)}</loc>
      <image:image>
        <image:loc>${esc(entry.image as string)}</image:loc>
        <image:caption>${esc(entry.caption)}</image:caption>
      </image:image>
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
