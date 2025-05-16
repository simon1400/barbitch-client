import { getMonthRange } from 'helpers/getMounthRange'
import qs from 'qs'

import { Axios } from '../../../lib/api'

interface IDataAdminsHours {
  sum: string
  personal: {
    name: string
  }
}

interface IDataPenalties {
  sum: string
  personal: {
    name: string
  }
}

interface IDataExtraProfit {
  sum: string
  personal: {
    name: string
  }
}

interface Result {
  name: string
  sum: number
  penalty: number
  extraProfit: number
  payrolls: number
}

export interface IFilteredAdminsData {
  summary: Result[]
  sumAdmins: number
}

function summarizeByName(
  data: IDataAdminsHours[],
  penaltyData: IDataPenalties[],
  extraProfit: IDataExtraProfit[],
  payrolls: IDataExtraProfit[],
): IFilteredAdminsData {
  const resultMap = new Map<string, Result>()
  let sumAdmins = 0

  data.forEach((item) => {
    const name = item.personal?.name
    if (!name) return

    const hours = Number.parseFloat(item.sum || '0')

    if (!resultMap.has(name)) {
      resultMap.set(name, {
        name,
        sum: 0,
        penalty: 0,
        extraProfit: 0,
        payrolls: 0,
      })
    }

    const result = resultMap.get(name)!
    result.sum += hours
  })

  penaltyData.forEach((item) => {
    const name = item.personal?.name
    if (!name || !resultMap.has(name)) return
    const sumPenalty = Number.parseFloat(item.sum || '0')
    const result = resultMap.get(name)!

    result.penalty += sumPenalty
  })

  extraProfit.forEach((item) => {
    const name = item.personal?.name
    if (!name || !resultMap.has(name)) return
    const sum = Number.parseFloat(item.sum || '0')
    const result = resultMap.get(name)!

    result.extraProfit += sum
  })
  payrolls.forEach((item) => {
    const name = item.personal?.name
    if (!name || !resultMap.has(name)) return
    const sum = Number.parseFloat(item.sum || '0')
    const result = resultMap.get(name)!

    result.payrolls += sum
  })

  const summary = Array.from(resultMap.values())

  summary.map((item) => {
    sumAdmins += item.sum * 115 + item.extraProfit - item.penalty - item.payrolls
    return null
  })

  return { summary, sumAdmins }
}

export const getAdminsHours = async (month: number) => {
  const { firstDay, lastDay } = getMonthRange(2025, month)

  const queryWorkTimes = qs.stringify(
    {
      filters: {
        start: {
          $gte: firstDay.toISOString(),
          $lte: lastDay.toISOString(),
        },
      },
      fields: ['start', 'sum'],
      populate: {
        personal: {
          fields: ['name'],
        },
      },
      pagination: {
        page: 1,
        pageSize: 70,
      },
    },
    {
      encodeValuesOnly: true,
    },
  )

  const queryPenaltiesAndProfits = qs.stringify(
    {
      filters: {
        date: {
          $gte: firstDay.toISOString(),
          $lte: lastDay.toISOString(),
        },
      },
      fields: ['sum'],
      populate: {
        personal: {
          fields: ['name'],
        },
      },
      pagination: {
        page: 1,
        pageSize: 200,
      },
    },
    {
      encodeValuesOnly: true,
    },
  )

  const data: IDataAdminsHours[] = await Axios.get(`/api/work-times?${queryWorkTimes}`)
  const dataPenalty: IDataPenalties[] = await Axios.get(
    `/api/penalties?${queryPenaltiesAndProfits}`,
  )
  const dataExtraProfit: IDataExtraProfit[] = await Axios.get(
    `/api/add-moneys?${queryPenaltiesAndProfits}`,
  )
  const dataPayroll: IDataExtraProfit[] = await Axios.get(
    `/api/payrolls?${queryPenaltiesAndProfits}`,
  )

  const filteredData = summarizeByName(data, dataPenalty, dataExtraProfit, dataPayroll)

  return {
    summary: filteredData.summary.sort((a, b) => b.sum - a.sum),
    sumAdmins: filteredData.sumAdmins,
  }
}
