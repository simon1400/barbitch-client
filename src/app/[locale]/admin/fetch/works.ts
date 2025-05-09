import { getMonthRange } from 'helpers/getMounthRange'
import qs from 'qs'

import { Axios } from '../../../../lib/api'

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

export const getWorks = async (name: string, month: number) => {
  const { firstDay, lastDay } = getMonthRange(2025, month)

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
              $gte: firstDay.toISOString(),
              $lte: lastDay.toISOString(),
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

  const total = data[0].offersDone.reduce((sum, item) => {
    const salary = Number.parseFloat(item.staffSalaries) || 0
    const tip = item.tip ? Number.parseFloat(item.tip) : 0
    return sum + salary + tip
  }, 0)

  console.log(total)

  return data[0]
}
