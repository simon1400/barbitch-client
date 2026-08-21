import { Axios } from 'lib/api'
import qs from 'qs'

interface IDataSlugs {
  slug: string
  updatedAt: string
}

export interface ISitemapRoute {
  update: string
  slug: string
  priority: string
  changefreq: string
}

const query = qs.stringify(
  {
    fields: ['slug', 'updatedAt'],
  },
  {
    encodeValuesOnly: true, // prettify URL
  },
)

// Výpadek jedné kolekce nesmí shodit celou mapu webu — dřív holý `Promise.all`
// znamenal, že jakákoli chyba Strapi vrátila 500 na /sitemap.xml celý.
const slugsOf = async (endpoint: string): Promise<IDataSlugs[]> => {
  try {
    const data = (await Axios.get(`/api/${endpoint}?${query}`)) as IDataSlugs[]
    return Array.isArray(data) ? data : []
  } catch (error) {
    console.error(`Failed to fetch sitemap slugs for ${endpoint}:`, error)
    return []
  }
}

// Slugy článků, které jsou v `next.config.ts` přesměrované jinam — do mapy webu
// nepatří (Google by dostal URL, která odpoví 301).
const REDIRECTED_ARTICLE_SLUGS = new Set(['hiring'])

export const getSitemapSlugs = async (): Promise<ISitemapRoute[]> => {
  const [slugArticles, slugPosts, slugServices] = await Promise.all([
    slugsOf('articles'),
    slugsOf('blogs'),
    slugsOf('services'),
  ])

  return [
    ...slugServices.map((item) => ({
      update: item.updatedAt,
      slug: `/service/${item.slug}`,
      priority: '0.8',
      changefreq: 'monthly',
    })),
    ...slugArticles
      .filter((item) => !REDIRECTED_ARTICLE_SLUGS.has(item.slug))
      .map((item) => ({
        update: item.updatedAt,
        // Právní a informační stránky nesoutěží s komerčními — nižší priorita.
        slug: `/${item.slug}`,
        priority: '0.5',
        changefreq: 'yearly',
      })),
    ...slugPosts.map((item) => ({
      update: item.updatedAt,
      slug: `/blog/${item.slug}`,
      priority: '0.8',
      changefreq: 'monthly',
    })),
  ]
}

/**
 * `lastmod` statických stránek — každá ze svého singletonu, ne jedno společné
 * maximum přes celé CMS. Když má 7 URL identický `lastmod`, Google mu přestane
 * věřit a přestane podle něj plánovat crawl.
 */
export const getSingletonDates = async (): Promise<Record<string, string | undefined>> => {
  const one = async (endpoint: string): Promise<string | undefined> => {
    try {
      const data = (await Axios.get(`/api/${endpoint}?fields[0]=updatedAt`)) as
        | { updatedAt?: string }
        | { updatedAt?: string }[]
      const item = Array.isArray(data) ? data[0] : data
      return item?.updatedAt
    } catch (error) {
      console.error(`Failed to fetch updatedAt for ${endpoint}:`, error)
      return undefined
    }
  }

  const [homepage, pricelist, contact, voucher] = await Promise.all([
    one('homepage'),
    one('pricelist-page'),
    one('contact'),
    one('vaucher-page'),
  ])

  return { homepage, pricelist, contact, voucher }
}
