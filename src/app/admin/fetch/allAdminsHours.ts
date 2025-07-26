import type { PersonalSumData } from './fetchHelpers'

import { getMonthRange } from 'helpers/getMounthRange'

import { buildQuery, fetchData, summarizeGeneric } from './fetchHelpers'

export interface ResultAdmins {
  name: string
  sum: number
  penalty: number
  extraProfit: number
  payrolls: number
}

export interface IFilteredAdminsData {
  summary: ResultAdmins[]
  sumAdmins: number
}

function summarizeAdmins(
  data: PersonalSumData[],
  penalty: PersonalSumData[],
  extra: PersonalSumData[],
  payrolls: PersonalSumData[],
): IFilteredAdminsData {
  const resultMap = new Map<string, ResultAdmins>()
  let sumAdmins = 0

  data.forEach(({ sum, personal }) => {
    const name = personal?.name
    if (!name) return
    const hours = Number.parseFloat(sum || '0')
    if (!resultMap.has(name)) {
      resultMap.set(name, { name, sum: 0, penalty: 0, extraProfit: 0, payrolls: 0 })
    }
    resultMap.get(name)!.sum += hours
  })

  summarizeGeneric(resultMap, penalty, 'penalty', ['Mariia Medvedeva'])
  summarizeGeneric(resultMap, extra, 'extraProfit', ['Mariia Medvedeva'])
  summarizeGeneric(resultMap, payrolls, 'payrolls')

  const summary = Array.from(resultMap.values())
  summary.forEach((item) => {
    sumAdmins += item.sum * 115 + item.extraProfit - item.penalty - item.payrolls
  })

  return { summary, sumAdmins }
}

export const getAdminsHours = async (month: number) => {
  const { firstDay, lastDay } = getMonthRange(2025, month)

  const filters = {
    date: { $gte: firstDay.toISOString(), $lte: lastDay.toISOString() },
  }

  const queryWorkTimes = buildQuery(
    { start: filters.date },
    ['start', 'sum'],
    { personal: { fields: ['name'] } },
    { page: 1, pageSize: 70 },
  )

  const genericQuery = buildQuery(filters, ['sum'], { personal: { fields: ['name'] } })

  const [data, penalties, extras, payrolls] = await Promise.all([
    fetchData<PersonalSumData>('/api/work-times', queryWorkTimes),
    fetchData<PersonalSumData>('/api/penalties', genericQuery),
    fetchData<PersonalSumData>('/api/add-moneys', genericQuery),
    fetchData<PersonalSumData>('/api/payrolls', genericQuery),
  ])

  const { summary, sumAdmins } = summarizeAdmins(data, penalties, extras, payrolls)

  return {
    summary: summary.sort((a, b) => b.sum - a.sum),
    sumAdmins,
  }
}
