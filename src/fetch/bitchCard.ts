import qs from 'qs'

import { Axios } from '../lib/api'

export interface IDataBitchCard {
  title: string
  slug: string
  contentText: string
}

export const getBitchCard = async () => {
  const query = qs.stringify(
    {
      filters: {
        slug: {
          $eq: 'bitchcard-2025',
        },
      },
      fields: ['title', 'contentText'],
    },
    {
      encodeValuesOnly: true, // prettify URL
    },
  )

  const dataContact: IDataBitchCard[] = await Axios.get(`/api/blogs?${query}`)
  return dataContact[0]
}

export const getBitchCardMeta = async () => {
  const query = qs.stringify(
    {
      filters: {
        slug: {
          $eq: 'bitchcard-2025',
        },
      },
      fields: ['title'],
      populate: ['metaData'],
    },
    {
      encodeValuesOnly: true, // prettify URL
    },
  )

  const data: IDataMetaWrap[] = await Axios.get(`/api/blogs?${query}`)
  return data[0]
}
