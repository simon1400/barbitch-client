import qs from 'qs'

import { Axios } from '../lib/api'

export interface IDataWorks {
  name: string
  offersDone: {
    id: number
    date: string
    clientName: string
    staffSalaries: string
    tip: string
  }[]
}

export const getWorks = async (name: string, month: number | string) => {
  const query = qs.stringify(
    {
      filters: {
        name: {
          $eq: name,
        },
      },
      fields: ['name'],
      populate: {
        offersDone: {
          sort: ['date:desc'],
          filters: {
            date: {
              $contains: `-${month}-`,
            },
          },
          fields: ['date', 'clientName', 'staffSalaries', 'tip'],
        },
      },
    },
    {
      encodeValuesOnly: true,
    },
  )

  const data: IDataWorks[] = await Axios.get(`/api/personals?${query}`)
  return data[0]
}
