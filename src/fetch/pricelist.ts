import qs from 'qs'

import { Axios } from '../lib/api'

export interface IDataPriceList {
  title: string
  table: {
    sectionTitle?: string
    title: string
    item: {
      title: string
      juniorPrice: string
      masterPrice?: string
      topMasterPrice?: string
      linkRezervation?: string
    }[]
  }[]
}

export const getPriceList = async (): Promise<IDataPriceList[]> => {
  const query = qs.stringify(
    {
      fields: ['title'],
      sort: ['order:asc'],
      populate: {
        table: {
          populate: ['item'],
        },
      },
    },
    {
      encodeValuesOnly: true,
    },
  )

  try {
    const data: IDataPriceList[] = await Axios.get(`/api/pricelists?${query}`)
    return data
  } catch (error) {
    console.error('Failed to fetch pricelist:', error)
    return []
  }
}

interface IDataPricelistPage {
  title: string
  contentText: string
  dynamicContent: any[]
}

export const getPricelistPage = async (): Promise<IDataPricelistPage> => {
  const queryPage = qs.stringify(
    {
      fields: ['title', 'contentText'],
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
          },
        },
      },
    },
    {
      encodeValuesOnly: true,
    },
  )

  try {
    const data: IDataPricelistPage = await Axios.get(`/api/pricelist-page?${queryPage}`)
    return data
  } catch (error) {
    console.error('Failed to fetch pricelist page:', error)
    return { title: '', contentText: '', dynamicContent: [] }
  }
}

export const getCurrentPriceList = async (name: string): Promise<IDataPriceList[]> => {
  const query = qs.stringify(
    {
      filters: {
        title: {
          $contains: name,
        },
      },
      populate: {
        table: {
          populate: ['item'],
        },
      },
    },
    {
      encodeValuesOnly: true,
    },
  )

  try {
    const data: IDataPriceList[] = await Axios.get(`/api/pricelists?${query}`)
    return data
  } catch (error) {
    console.error('Failed to fetch current pricelist:', error)
    return []
  }
}
