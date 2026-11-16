import { getAllPost, postDate } from 'fetch/blog'
import { SITE_URL } from 'lib/seo'
import { NextResponse } from 'next/server'

export const revalidate = 3600

/** RSS je XML — `&` v titulku nebo slugu by jinak rozbil celý dokument. */
const esc = (value: string): string =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;')

export async function GET() {
  // Nejnovější první podle data první publikace (`blog.date`, s291); přesměrované
  // články `getAllPost` vynechává.
  const posts = await getAllPost()

  const items = posts
    .slice(0, 20)
    .map((post) => {
      const url = `${SITE_URL}/blog/${post.slug}`
      const published = postDate(post)
      const title = post.title.replaceAll(';sp;', ' ')

      return `
    <item>
      <title>${esc(title)}</title>
      <link>${esc(url)}</link>
      <guid isPermaLink="true">${esc(url)}</guid>${
        published ? `\n      <pubDate>${new Date(published).toUTCString()}</pubDate>` : ''
      }
    </item>`
    })
    .join('')

  const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>B.B.Blog — Barbitch Brno</title>
    <link>${SITE_URL}/blog</link>
    <description>Manikúra, řasy a obočí — tipy a trendy z beauty studia Barbitch v Brně.</description>
    <language>cs</language>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml" />${items}
  </channel>
</rss>`

  return new NextResponse(feed, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400',
    },
  })
}
