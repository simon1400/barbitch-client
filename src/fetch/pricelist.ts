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
