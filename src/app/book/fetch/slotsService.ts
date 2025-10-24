import {
  addMonths,
  endOfMonth,
  format,
  isAfter,
  isEqual,
  parseISO,
  startOfDay,
  subDays,
} from 'date-fns'
import { Noona } from 'lib/api'

import { getPersonalService } from './personalService'

const NOONA_COMPANY_ID = process.env.NOONA_COMPANY_ID || ''

export interface ISlotService {
  date: string
  slots: {
    employeeIds: string[]
    time: string
  }[]
}

export const filterFutureDates = (data: ISlotService[]) => {
  const today = startOfDay(new Date())

  return data.filter((item) => {
    const itemDate = startOfDay(parseISO(item.date))
    return isAfter(itemDate, today) || isEqual(itemDate, today)
  })
}

export const getSlotService = async (eventId: string, employeesId: string) => {
  const today = new Date()

  const currentMonth = today.getMonth() + 1
  const currentYear = today.getFullYear()

  const yesterday = subDays(today, 1)
  const startMonth =
    yesterday.getMonth() + 1 === currentMonth
      ? yesterday
      : new Date(currentYear, currentMonth - 1, 1)
  const start_date = format(startMonth, 'yyyy-MM-dd')

  const endMonth = addMonths(today, 3)
  const end_date = format(endOfMonth(endMonth), 'yyyy-MM-dd')

  const queryParams: Record<string, any> = {
    start_date,
    end_date,
    event_type_ids: eventId,
    type: 'available',
    select: ['date', 'slots.employeeIds', 'slots.time'],
  }

  if (employeesId === 'any') {
    const employees = await getPersonalService(eventId)
    queryParams.employee_ids = employees.map((item: { id: string }) => item.id)
  } else {
    queryParams.employee_id = employeesId
  }

  const queryString = new URLSearchParams()
  Object.entries(queryParams).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((val) => queryString.append(key, val.toString()))
    } else {
      queryString.append(key, value.toString())
    }
  })

  const response = await Noona.get(
    `/companies/${NOONA_COMPANY_ID}/time_slots?${queryString.toString()}`,
  )

  if (!response.data) return { executeDate: [], filteredData: [] }

  const filteredData = filterFutureDates(response.data)

  const executeDate = filteredData
    .filter((item) => !item.slots.length)
    .map((item) => parseISO(item.date))

  return {
    executeDate,
    filteredData,
  }
}
