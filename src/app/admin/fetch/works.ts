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

interface IDataPenalties {
  sum: string
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

  const queryPenalty = qs.stringify(
    {
      filters: {
        personal: {
          name: { $eq: name },
        },
        date: {
          $gte: firstDay.toISOString(),
          $lte: lastDay.toISOString(),
        },
      },
      fields: ['sum'],
    },
    {
      encodeValuesOnly: true,
    },
  )

  const data: IDataWorks[] = await Axios.get(`/api/personals?${query}`)
  const dataPenalty: IDataPenalties[] = await Axios.get(`/api/penalties?${queryPenalty}`)
  const dataExtraProfit: IDataPenalties[] = await Axios.get(`/api/add-moneys?${queryPenalty}`)
  const dataPayroll: IDataPenalties[] = await Axios.get(`/api/payrolls?${queryPenalty}`)

  const penalty = dataPenalty.reduce((sum, item) => +sum + +item.sum, 0)
  const extraProfit = dataExtraProfit.reduce((sum, item) => +sum + +item.sum, 0)
  const payrolls = dataPayroll.reduce((sum, item) => +sum + +item.sum, 0)

  let tipSum = 0

  const salary = data[0].offersDone.reduce((sum, item) => {
    const salary = Number.parseFloat(item.staffSalaries) || 0
    const tip = item.tip ? Number.parseFloat(item.tip) : 0
    tipSum += tip
    return sum + salary + tip
  }, 0)

  const result = salary + extraProfit - payrolls - penalty

  // console.log(result)

  return {
    works: data[0],
    salary,
    extraProfit,
    payrolls,
    penalty,
    result,
    tipSum,
  }
}
