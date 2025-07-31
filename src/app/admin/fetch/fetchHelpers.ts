import qs from 'qs'

import { Axios } from '../../../lib/api'

export const buildQuery = (
  filters: Record<string, any>,
  fields: string[],
  populate?: Record<string, any>,
  pagination: { page: number; pageSize: number } = { page: 1, pageSize: 200 },
) => {
  return qs.stringify(
    {
      filters,
      fields,
      populate,
      pagination,
    },
    { encodeValuesOnly: true },
  )
}

export const buildQueryCost = (
  fields: string[],
  dateField: string,
  firstDay: Date,
  lastDay: Date,
) =>
  qs.stringify(
    {
      filters: {
        [dateField]: {
          $gte: firstDay.toISOString(),
          $lte: lastDay.toISOString(),
        },
      },
      fields,
      pagination: {
        page: 1,
        pageSize: 40,
      },
    },
    { encodeValuesOnly: true },
  )

export const fetchData = async <T>(endpoint: string, query: string): Promise<T[]> => {
  return await Axios.get(`${endpoint}?${query}`)
}

export interface PersonalSumData {
  sum: string
  personal: {
    name: string
  }
}

export const summarizeGeneric = (
  base: Map<string, any>,
  data: PersonalSumData[],
  field: keyof any,
  excludeNames: string[] = [],
) => {
  for (const item of data) {
    const name = item.personal?.name
    if (!name || !base.has(name) || excludeNames.includes(name)) continue
    const sum = Number.parseFloat(item.sum || '0')
    base.get(name)![field] += sum
  }
}

function formatDate(date: Date): string {
  return date.toISOString().slice(0, 10) // YYYY-MM-DD
}

interface Entry {
  date: string
  salonSalaries: string
  staffSalaries: string
  tip: string | null
}

export interface GroupedSum {
  date: string
  sum: number
}

export function groupAndSumByDateWithGaps(data: Entry[]): GroupedSum[] {
  const map = new Map<string, number>()

  data.forEach(({ date, salonSalaries, staffSalaries, tip }) => {
    const total = Number(salonSalaries) + Number(staffSalaries) + (tip ? Number(tip) : 0)

    map.set(date, (map.get(date) || 0) + total)
  })

  const dates = Array.from(map.keys()).sort((a, b) => new Date(a).getTime() - new Date(b).getTime())

  if (dates.length === 0) return []

  const result: GroupedSum[] = []
  const currentDate = new Date(dates[0])
  const endDate = new Date(dates[dates.length - 1])

  // eslint-disable-next-line no-unmodified-loop-condition
  while (currentDate <= endDate) {
    const dateStr = formatDate(currentDate)
    result.push({
      date: dateStr,
      sum: map.get(dateStr) ?? 0,
    })
    currentDate.setDate(currentDate.getDate() + 1)
  }

  return result
}
