import { getAllPost } from 'fetch/blog'
import { Axios } from 'lib/api'
import { SITE_URL } from 'lib/seo'
import { NextResponse } from 'next/server'
import qs from 'qs'

export const revalidate = 3600

/** RSS je XML — `&` v titulku nebo slugu by jinak rozbil celý dokument. */
const esc = (value: string): string =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;')

interface IPostDate {
  slug: string
  publishedAt?: string
}

/** Data vydání pro `pubDate` — `getAllPost` je nevrací. */
const publishDates = async (): Promise<Map<string, string>> => {
  const query = qs.stringify(
    { fields: ['slug', 'publishedAt'], sort: ['publishedAt:desc'], pagination: { limit: 100 } },
    { encodeValuesOnly: true },
  )
  try {
    const data = (await Axios.get(`/api/blogs?${query}`)) as IPostDate[]
    return new Map(data.filter((p) => p.publishedAt).map((p) => [p.slug, p.publishedAt as string]))
  } catch (error) {
    console.error('Failed to fetch post dates for feed:', error)
    return new Map()
  }
}

export async function GET() {
  const [posts, dates] = await Promise.all([getAllPost(), publishDates()])

  const items = posts
    .slice(0, 20)
    .map((post) => {
      const url = `${SITE_URL}/blog/${post.slug}`
      const published = dates.get(post.slug)
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
