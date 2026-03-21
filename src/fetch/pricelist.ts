import qs from 'qs'

import { Axios } from '../lib/api'

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

