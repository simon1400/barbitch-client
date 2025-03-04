import qs from 'qs'

import { Axios } from '../lib/api'

export interface IDataBitchCard {
  title: string
  slug: string
  content: string
}

export const getArticle = async (slug: string) => {
  const query = qs.stringify(
    {
      filters: {
        slug: {
          $eq: slug,
        },
      },
      fields: ['title', 'content'],
    },
    {
      encodeValuesOnly: true, // prettify URL
    },
  )

  const dataContact: IDataBitchCard[] = await Axios.get(`/api/articles?${query}`)
  return dataContact[0]
}

export const getArticleMeta = async (slug: string) => {
  const query = qs.stringify(
    {
      filters: {
        slug: {
          $eq: slug,
        },
      },
      fields: ['title'],
      populate: ['metaData'],
    },
    {
      encodeValuesOnly: true, // prettify URL
    },
  )

  const data: IDataMetaWrap[] = await Axios.get(`/api/articles?${query}`)
  return data[0]
}
