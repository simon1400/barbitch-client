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
    encodeValuesOnly: true, // prettify URL
  },
)

export const getServiceHomepage = async () => {
  const dataService: IDataHomepageService[] = await Axios.get(
    `/api/services?${queryServiceHomepage}`,
  )
  return dataService
}

export const getFullService = async (slug: string) => {
  const query = qs.stringify(
    {
      filters: {
        slug: {
          $eq: slug,
        },
      },
      fields: ['title', 'description', 'additionalDescription'],
      populate: {
        dynamicContent: {
          on: {
            'content.text': {
              populate: '*',
            },
            'content.price-list': {
              populate: {
                pricelistTable: {
                  populate: {
                    table: {
                      populate: ['item'],
                    },
                  },
                },
                cta: {
                  populate: '*',
                },
              },
            },
            'content.content-baner': {
              populate: '*',
            },
            'content.galery': {
              populate: {
                image: {
                  fields: ['url', 'hash', 'alternativeText'],
                },
              },
            },
            'content.faq': {
              populate: '*',
            },
          },
        },
      },
    },
    {
      encodeValuesOnly: true, // prettify URL
    },
  )

  const dataContact: IDataFullService[] = await Axios.get(`/api/services?${query}`)
  return dataContact[0]
}
