import qs from 'qs'

import { Axios } from '../lib/api'

export interface IDataPriceList {
  title: string
  table: {
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

export const getPriceList = async () => {
  const query = qs.stringify(
    {
      fields: ['title'],
      populate: {
        table: {
          populate: ['item'],
        },
      },
    },
    {
      encodeValuesOnly: true, // prettify URL
    },
  )

  const data: IDataPriceList[] = await Axios.get(`/api/pricelists?${query}`)
  return data
}

interface IDataPricelistPage {
  title: string
  contentText: string
}

export const getPricelistPage = async () => {
  const queryPage = qs.stringify(
    {
      fields: ['title', 'contentText'],
    },
    {
      encodeValuesOnly: true, // prettify URL
    },
  )

  const data: IDataPricelistPage = await Axios.get(`/api/pricelist-page?${queryPage}`)

  return data
}

export const getCurrentPriceList = async (name: string) => {
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
      encodeValuesOnly: true, // prettify URL
    },
  )

  const data: IDataPriceList[] = await Axios.get(`/api/pricelists?${query}`)
  return data
}
