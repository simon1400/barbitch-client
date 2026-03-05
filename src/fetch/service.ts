import qs from 'qs'

import { Axios } from '../lib/api'

export interface IDataHomepageService {
  shortTitle: string
  slug: string
}

export interface IDataFullService {
  title: string
  dynamicContent: any[]
}

const queryServiceHomepage = qs.stringify(
  {
    fields: ['shortTitle', 'slug'],
  },
  {
    encodeValuesOnly: true,
  },
)

export const getServiceHomepage = async (): Promise<IDataHomepageService[]> => {
  try {
    const dataService: IDataHomepageService[] = await Axios.get(
      `/api/services?${queryServiceHomepage}`,
    )
    return dataService
  } catch (error) {
    console.error('Failed to fetch homepage services:', error)
    return []
  }
}

export const getFullService = async (slug: string): Promise<IDataFullService> => {
  const query = qs.stringify(
    {
      filters: {
        slug: {
          $eq: slug,
        },
      },
      fields: ['title'],
      populate: {
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
              fields: ['title', 'contentBefore', 'contentAfter'],
              populate: {
                cta: {
                  fields: ['title', 'link'],
                },
                pricelistTable: {
                  fields: ['title'],
                },
              },
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
    const data: IDataFullService[] = await Axios.get(`/api/services?${query}`)
    if (!data || data.length === 0) {
      throw new Error(`Service not found: ${slug}`)
    }
    return data[0]
  } catch (error) {
    console.error('Failed to fetch full service:', error)
    throw error
  }
}
