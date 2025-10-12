import type { IComboServiceItem } from './comboService'

import {
  addMinutes,
  addMonths,
  endOfMonth,
  format,
  // isAfter,
  // isEqual,
  parse,
  parseISO,
  // startOfDay,
  subDays,
} from 'date-fns'
import { Noona } from 'lib/api'

import { filterFutureDates } from './slotsService'

const NOONA_COMPANY_ID = process.env.NOONA_COMPANY_ID || ''

export interface IComboSlot {
  date: string
  slots: {
    time: string
    services: {
      serviceId: string
      employeeId: string
      startTime: string
      endTime: string
    }[]
  }[]
}

interface ISlotData {
  date: string
  slots: {
    employeeIds: string[]
    time: string
  }[]
}

/**
 * Получает доступные слоты для одной услуги
 */
const getSlotsForService = async (
  serviceId: string,
  start_date: string,
  end_date: string,
): Promise<ISlotData[]> => {
  const queryParams: Record<string, any> = {
    start_date,
    end_date,
    event_type_ids: serviceId,
    type: 'available',
    select: ['date', 'slots.employeeIds', 'slots.time'],
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

  return response.data || []
}

/**
 * Проверяет, есть ли последовательные слоты для всех услуг комбо
 */
const findSequentialSlots = (
  slotsData: Map<string, ISlotData[]>,
  comboServices: IComboServiceItem[],
  date: string,
): {
  time: string
  services: {
    serviceId: string
    employeeId: string
    startTime: string
    endTime: string
  }[]
}[] => {
  const result: {
    time: string
    services: {
      serviceId: string
      employeeId: string
      startTime: string
      endTime: string
    }[]
  }[] = []

  // Получаем слоты для первой услуги (она будет отправной точкой)
  const firstService = comboServices[0]
  const firstServiceSlots = slotsData.get(firstService.serviceId)

  if (!firstServiceSlots) return result

  const dateSlots = firstServiceSlots.find((item) => item.date === date)
  if (!dateSlots || !dateSlots.slots.length) return result

  // Проходим по каждому слоту первой услуги
  for (const firstSlot of dateSlots.slots) {
    if (!firstSlot.employeeIds || firstSlot.employeeIds.length === 0) continue

    // Пробуем для каждого сотрудника первой услуги
    for (const firstEmployeeId of firstSlot.employeeIds) {
      const comboSlot: {
        serviceId: string
        employeeId: string
        startTime: string
        endTime: string
      }[] = []

      let currentTime = firstSlot.time
      let isValid = true

      // Проверяем все услуги последовательно
      for (let i = 0; i < comboServices.length; i++) {
        const service = comboServices[i]
        const serviceSlots = slotsData.get(service.serviceId)

        if (!serviceSlots) {
          isValid = false
          break
        }

        const serviceDateSlots = serviceSlots.find((item) => item.date === date)
        if (!serviceDateSlots) {
          isValid = false
          break
        }

        // Ищем слот в нужное время
        const matchingSlot = serviceDateSlots.slots.find((slot) => slot.time === currentTime)

        if (!matchingSlot || !matchingSlot.employeeIds || matchingSlot.employeeIds.length === 0) {
          isValid = false
          break
        }

        // Для первой услуги используем выбранного сотрудника
        // Для остальных берём первого доступного (или можно добавить логику выбора)
        const employeeId = i === 0 ? firstEmployeeId : matchingSlot.employeeIds[0]

        // Проверяем, что этот сотрудник доступен
        if (!matchingSlot.employeeIds.includes(employeeId)) {
          isValid = false
          break
        }

        const startTime = currentTime
        const parsedTime = parse(currentTime, 'HH:mm', new Date())
        const endTime = format(addMinutes(parsedTime, service.minutes), 'HH:mm')

        comboSlot.push({
          serviceId: service.serviceId,
          employeeId,
          startTime,
          endTime,
        })

        // Переходим к следующему временному слоту
        currentTime = endTime
      }

      // Если все услуги нашли свои слоты, добавляем в результат
      if (isValid && comboSlot.length === comboServices.length) {
        // Проверяем, не добавили ли мы уже этот слот
        const alreadyExists = result.some((r) => r.time === firstSlot.time)
        if (!alreadyExists) {
          result.push({
            time: firstSlot.time,
            services: comboSlot,
          })
        }
      }
    }
  }

  return result
}

/**
 * Получает доступные комбо-слоты для всех услуг в комбинации
 */
export const getComboSlots = async (
  comboServices: IComboServiceItem[],
): Promise<{ executeDate: Date[]; filteredData: IComboSlot[] }> => {
  const today = new Date()

  const currentMonth = today.getMonth() + 1
  const currentYear = today.getFullYear()

  const yesterday = subDays(today, 1)
  const startMonth =
    yesterday.getMonth() + 1 === currentMonth
      ? yesterday
      : new Date(currentYear, currentMonth - 1, 1)
  const start_date = format(startMonth, 'yyyy-MM-dd')

  const endMonth = addMonths(today, 2)
  const end_date = format(endOfMonth(endMonth), 'yyyy-MM-dd')

  // Получаем слоты для всех услуг параллельно
  const slotsPromises = comboServices.map((service) =>
    getSlotsForService(service.serviceId, start_date, end_date),
  )

  const allSlotsData = await Promise.all(slotsPromises)

  // Создаём Map для быстрого доступа к слотам по serviceId
  const slotsMap = new Map<string, ISlotData[]>()
  comboServices.forEach((service, index) => {
    slotsMap.set(service.serviceId, allSlotsData[index])
  })

  // Получаем все уникальные даты из первой услуги
  const firstServiceSlots = allSlotsData[0]
  if (!firstServiceSlots || firstServiceSlots.length === 0) {
    return { executeDate: [], filteredData: [] }
  }

  const filteredDates = filterFutureDates(firstServiceSlots)

  // Для каждой даты ищем последовательные слоты
  const comboSlots: IComboSlot[] = filteredDates.map((dateSlot) => {
    const sequentialSlots = findSequentialSlots(slotsMap, comboServices, dateSlot.date)

    return {
      date: dateSlot.date,
      slots: sequentialSlots,
    }
  })

  // Отфильтровываем даты без доступных слотов для executeDate (disabled dates)
  const executeDate = comboSlots
    .filter((item) => item.slots.length === 0)
    .map((item) => parseISO(item.date))

  return {
    executeDate,
    filteredData: comboSlots,
  }
}
