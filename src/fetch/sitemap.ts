import { Axios } from 'lib/api'
import qs from 'qs'

interface IDataSlugs {
  slug: string
  updatedAt: string
}

const query = qs.stringify(
  {
    fields: ['slug', 'updatedAt'],
  },
  {
    encodeValuesOnly: true, // prettify URL
  },
)

export const getSitemapSlugs = async () => {
  const slugArticles: IDataSlugs[] = await Axios.get(`/api/articles?${query}`)
  const slugPosts: IDataSlugs[] = await Axios.get(`/api/blogs?${query}`)
  const slugServices: IDataSlugs[] = await Axios.get(`/api/services?${query}`)
  const combile = [
    ...slugServices.map((item) => ({
      update: item.updatedAt,
      slug: `/service/${item.slug}`,
      priority: '0.8',
      changefreq: 'monthly',
    })),
    ...slugArticles.map((item) => ({
      update: item.updatedAt,
      slug: `/${item.slug}`,
      priority: '0.7',
      changefreq: 'yearly',
    })),
    ...slugPosts.map((item) => ({
      update: item.updatedAt,
      slug: `/blog/${item.slug}`,
      priority: '0.8',
      changefreq: 'monthly',
    })),
  ]

  return combile
}
