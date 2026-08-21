import { revalidatePath } from 'next/cache'
import { NextResponse } from 'next/server'

/**
 * Webhook ze Strapi: po publikaci obsahu shodí ISR cache konkrétní stránky
 * a ohlásí změnu do IndexNow (Bing a Seznam.cz — v Česku podstatný podíl).
 *
 * Bez něj se nová verze objeví až po vypršení `revalidate` (1 h).
 *
 * Nastavení ve Strapi: Settings → Webhooks → nový webhook na
 * `https://barbitch.cz/api/revalidate?secret=…` s událostmi
 * `entry.publish` / `entry.update` / `entry.unpublish`.
 */
const SECRET = process.env.REVALIDATE_SECRET
const INDEXNOW_KEY = process.env.INDEXNOW_KEY || '7abbde774c5546ffba5f6a63c57aa7e0'
const SITE = 'https://barbitch.cz'

// Které kolekce se promítají do kterých cest.
const PATH_FOR: Record<string, (slug?: string) => string[]> = {
  article: (slug) => (slug ? [`/${slug}`] : []),
  banner: () => ['/'],
  blog: (slug) => ['/blog', ...(slug ? [`/blog/${slug}`] : [])],
  'blog-page': () => ['/blog'],
  contact: () => ['/kontakt', '/'],
  homepage: () => ['/'],
  'pricelist-page': () => ['/cenik'],
  service: (slug) => (slug ? [`/service/${slug}`] : []),
  'vaucher-page': () => ['/darkovy-voucher'],
}

const pingIndexNow = async (paths: string[]) => {
  try {
    await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        host: 'barbitch.cz',
        key: INDEXNOW_KEY,
        keyLocation: `${SITE}/${INDEXNOW_KEY}.txt`,
        urlList: paths.map((path) => `${SITE}${path}`),
      }),
    })
  } catch (error) {
    // Ping je best-effort — jeho selhání nesmí shodit revalidaci.
    console.error('IndexNow ping failed:', error)
  }
}

export async function POST(request: Request) {
  if (!SECRET) {
    return NextResponse.json({ error: 'revalidate_secret_not_configured' }, { status: 503 })
  }

  const { searchParams } = new URL(request.url)
  if (searchParams.get('secret') !== SECRET) {
    return NextResponse.json({ error: 'invalid_secret' }, { status: 401 })
  }

  let body: { model?: string; entry?: { slug?: string } }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'invalid_body' }, { status: 400 })
  }

  const model = body?.model
  const slug = body?.entry?.slug
  const paths = model && PATH_FOR[model] ? PATH_FOR[model](slug) : []

  if (paths.length === 0) {
    return NextResponse.json({ revalidated: [], reason: 'no_mapping_for_model', model })
  }

  // Sitemapa se mění při každé publikaci — `lastmod` musí jít ven zároveň.
  const allPaths = [...paths, '/sitemap.xml']
  for (const path of allPaths) revalidatePath(path)

  await pingIndexNow(paths)

  return NextResponse.json({ revalidated: allPaths })
}
