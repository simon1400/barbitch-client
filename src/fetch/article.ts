import qs from 'qs'

import { Axios } from '../lib/api'

export interface IDataArticle {
  title: string
  slug: string
  dynamicContent: any[]
  publishedAt?: string
  updatedAt?: string
  metaData?: {
    title?: string
    description?: string
    image?: IGalery
  }
}

export const getArticle = async (slug: string): Promise<IDataArticle | undefined> => {
  const query = qs.stringify(
    {
      filters: {
        slug: {
          $eq: slug,
        },
      },
      fields: ['title', 'publishedAt', 'updatedAt'],
      populate: {
        metaData: {
          populate: ['image'],
        },
        dynamicContent: {
          on: {
            'content.text': {
              populate: '*',
            },
            'content.content-baner': {
              populate: {
                cta: {
                  fields: ['title', 'link'],
                },
                image: {
                  fields: ['url', 'alternativeText'],
                },
              },
            },
            'content.galery': {
              populate: {
                image: {
                  fields: ['url', 'alternativeText'],
                },
              },
            },
            'content.faq': {
              populate: '*',
            },
            'content.price-list': {
              populate: '*',
            },
          },
        },
      },
    },
    {
      encodeValuesOnly: true,
    },
  )

  try {
    const data: IDataArticle[] = await Axios.get(`/api/articles?${query}`)
    return data[0]
  } catch (error) {
    console.error('Failed to fetch article:', error)
    return undefined
  }
}
