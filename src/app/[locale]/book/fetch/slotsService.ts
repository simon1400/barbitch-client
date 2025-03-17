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
  let employes = []
  if (employeesId === 'any') {
    employes = await getPersonalService(eventId)
    console.log(employes)
  }

  const today = new Date()

  // Получаем актуальный месяц в формате 'MM'
  const currentMonth = today.getMonth() + 1
  const currentYear = today.getFullYear()

  // Определяем `start_date`: вчерашний день текущего месяца или 1-е число месяца
  const yesterday = subDays(today, 1)
  const startMonth =
    yesterday.getMonth() + 1 === currentMonth
      ? yesterday
      : new Date(currentYear, currentMonth - 1, 1)
  const start_date = `${format(startMonth, 'yyyy-MM-dd')}`

  // Определяем `end_date`: последний день месяца через 2 месяца
  const endMonth = addMonths(today, 2)
  const end_date = format(endOfMonth(endMonth), 'yyyy-MM-dd')

  const queryString = new URLSearchParams()

  const queryParams = {
    start_date,
    end_date,
    event_type_ids: eventId,
    employee_ids: employes?.length
      ? employes.map((item: { id: string }) => item.id)
      : [employeesId],
    type: 'available',
    select: ['date', 'slots.employeeIds', 'slots.time'],
  }

  Object.entries(queryParams).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((val) => queryString.append(key, val))
    } else {
      queryString.append(key, value.toString())
    }
  })

  const data = await Noona.get(`/companies/8qcJwRg6dbNh6Gqvm/time_slots?${queryString.toString()}`)

  const filteredDates = filterFutureDates(data.data)
    .filter((item) => item.slots.length === 0)
    .map((item) => parseISO(item.date))

  return {
    executeDate: filteredDates,
    filteredData: filterFutureDates(data.data),
  }
}
