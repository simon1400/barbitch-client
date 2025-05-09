/* eslint-disable eqeqeq */
import { getMonthRange } from 'helpers/getMounthRange'
import qs from 'qs'

import { Axios } from '../../../../lib/api'

interface IDataAllWorks {
  name: string
  staffSalaries: string
  salonSalaries: string
  tip: string
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
  sumTip: number
  countClient: number
  penalty: number
  extraProfit: number
  payrolls: number
}

export interface IFilteredData {
  summary: Result[]
  globalFlow: number
  sumMasters: number
  sumClientsDone: number
}

function summarizeByName(
  data: IDataAllWorks[],
  penaltyData: IDataPenalties[],
  extraProfit: IDataExtraProfit[],
  payrolls: IDataExtraProfit[],
): IFilteredData {
  const resultMap = new Map<string, Result>()
  let globalSum = 0
  let sumClientsDone = 0
  let sumMasters = 0

  data.forEach((item) => {
    const name = item.personal?.name
    if (!name) return

    const staffSalaries = Number.parseFloat(item.staffSalaries || '0')
    const salonSalaries = Number.parseFloat(item.salonSalaries || '0')
    const tip = Number.parseFloat(item.tip || '0')

    const sum = staffSalaries + salonSalaries + tip

    globalSum += sum

    if (!resultMap.has(name)) {
      resultMap.set(name, {
        name,
        sum: 0,
        sumTip: 0,
        countClient: 0,
        penalty: 0,
        extraProfit: 0,
        payrolls: 0,
      })
    }

    const result = resultMap.get(name)!
    result.sum += staffSalaries
    result.sumTip += tip
    result.countClient += 1
  })

  penaltyData.forEach((item) => {
    const name = item.personal?.name
    if (!name || !resultMap.has(name) || name == 'Mariia Medvedeva') return
    const sumPenalty = Number.parseFloat(item.sum || '0')
    const result = resultMap.get(name)!

    result.penalty += sumPenalty
  })

  extraProfit.forEach((item) => {
    const name = item.personal?.name
    if (!name || !resultMap.has(name) || name == 'Mariia Medvedeva') return
    const sum = Number.parseFloat(item.sum || '0')
    const result = resultMap.get(name)!

    result.extraProfit += sum
  })

  payrolls.forEach((item) => {
    const name = item.personal?.name
    if (!name || !resultMap.has(name) || name == 'Mariia Medvedeva') return
    const sum = Number.parseFloat(item.sum || '0')
    const result = resultMap.get(name)!

    result.payrolls += sum
  })

  const summary = Array.from(resultMap.values())

  summary.map((item) => {
    sumMasters += item.sum + item.sumTip + item.extraProfit - item.penalty - item.payrolls
    sumClientsDone += item.countClient
    return null
  })

  return { summary, globalFlow: globalSum, sumMasters, sumClientsDone }
}

export const getAllWorks = async (month: number) => {
  const { firstDay, lastDay } = getMonthRange(2025, month)

  const filters = {
    date: {
      $gte: firstDay.toISOString(),
      $lte: lastDay.toISOString(),
    },
  }

  const pagination = {
    page: 1,
    pageSize: 200,
  }

  const populate = {
    personal: {
      fields: ['name'],
    },
  }

  const queryServiceProvided = qs.stringify(
    {
      filters,
      fields: ['staffSalaries', 'salonSalaries', 'tip'],
      populate,
      pagination,
    },
    {
      encodeValuesOnly: true,
    },
  )

  const queryPenaltiesAndProfits = qs.stringify(
    {
      filters,
      fields: ['sum'],
      populate,
      pagination,
    },
    {
      encodeValuesOnly: true,
    },
  )

  const data: IDataAllWorks[] = await Axios.get(`/api/services-provided?${queryServiceProvided}`)
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
    summary: filteredData.summary,
    globalFlow: filteredData.globalFlow,
    sumMasters: filteredData.sumMasters,
    sumClientsDone: filteredData.sumClientsDone,
  }
}
