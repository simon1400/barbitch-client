import qs from 'qs'

import { Axios } from '../lib/api'

export interface IDataInsidePage {
  title: string
  description: string
  additionalDescription: string
  galery: {
    url: string
    name: string
  }[]
  meta: {
    title: string
    description: string
    image: {
      url: string
    }
  }
}

export const getInsidePage = async (slug: string) => {
  const query = qs.stringify(
    {
      filters: {
        slug: {
          $eq: slug,
        },
      },
      fields: ['title', 'description', 'additionalDescription'],
      populate: ['galery', 'metaData'],
    },
    {
      encodeValuesOnly: true, // prettify URL
    },
  )

  const dataContact: IDataInsidePage[] = await Axios.get(`/api/services?${query}`)
  return dataContact[0]
}
