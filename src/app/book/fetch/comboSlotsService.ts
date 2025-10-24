import type { IComboServiceItem } from './comboService'

import { addMinutes, addMonths, endOfMonth, format, parse, parseISO, subDays } from 'date-fns'
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

interface ComboSlotService {
  serviceId: string
  employeeId: string
  startTime: string
  endTime: string
}

interface ComboSlotResult {
  time: string
  services: ComboSlotService[]
}

/**
 * Находит слоты для конкретной даты из данных услуги
 */
const getDateSlots = (slotsData: ISlotData[], date: string) => {
  return slotsData.find((item) => item.date === date)
}

/**
 * Проверяет валидность слота для услуги
 */
const isSlotValid = (slot: { employeeIds: string[]; time: string } | undefined): boolean => {
  return !!(slot && slot.employeeIds && slot.employeeIds.length > 0)
}

/**
 * Вычисляет время окончания услуги
 */
const calculateEndTime = (startTime: string, minutes: number): string => {
  const parsedTime = parse(startTime, 'HH:mm', new Date())
  return format(addMinutes(parsedTime, minutes), 'HH:mm')
}

/**
 * Проверяет доступность всех услуг последовательно
 */
const checkSequentialAvailability = (
  slotsData: Map<string, ISlotData[]>,
  comboServices: IComboServiceItem[],
  date: string,
  startTime: string,
  firstEmployeeId: string,
): ComboSlotService[] | null => {
  const comboSlot: ComboSlotService[] = []
  let currentTime = startTime

  for (let i = 0; i < comboServices.length; i++) {
    const service = comboServices[i]
    const serviceSlots = slotsData.get(service.serviceId)

    if (!serviceSlots) return null

    const serviceDateSlots = getDateSlots(serviceSlots, date)
    if (!serviceDateSlots) return null

    const matchingSlot = serviceDateSlots.slots.find((slot) => slot.time === currentTime)

    if (!isSlotValid(matchingSlot)) return null

    const employeeId = i === 0 ? firstEmployeeId : matchingSlot!.employeeIds[0]

    if (!matchingSlot!.employeeIds.includes(employeeId)) return null

    const endTime = calculateEndTime(currentTime, service.minutes)

    comboSlot.push({
      serviceId: service.serviceId,
      employeeId,
      startTime: currentTime,
      endTime,
    })

    currentTime = endTime
  }

  return comboSlot
}

/**
 * Обрабатывает один слот первой услуги
 */
const processFirstSlot = (
  firstSlot: { employeeIds: string[]; time: string },
  slotsData: Map<string, ISlotData[]>,
  comboServices: IComboServiceItem[],
  date: string,
): ComboSlotResult | null => {
  if (!firstSlot.employeeIds || firstSlot.employeeIds.length === 0) return null

  for (const firstEmployeeId of firstSlot.employeeIds) {
    const comboSlot = checkSequentialAvailability(
      slotsData,
      comboServices,
      date,
      firstSlot.time,
      firstEmployeeId,
    )

    if (comboSlot && comboSlot.length === comboServices.length) {
      return {
        time: firstSlot.time,
        services: comboSlot,
      }
    }
  }

  return null
}

/**
 * Проверяет, есть ли последовательные слоты для всех услуг комбо
 */
const findSequentialSlots = (
  slotsData: Map<string, ISlotData[]>,
  comboServices: IComboServiceItem[],
  date: string,
): ComboSlotResult[] => {
  const result: ComboSlotResult[] = []

  const firstService = comboServices[0]
  const firstServiceSlots = slotsData.get(firstService.serviceId)

  if (!firstServiceSlots) return result

  const dateSlots = getDateSlots(firstServiceSlots, date)
  if (!dateSlots || !dateSlots.slots.length) return result

  for (const firstSlot of dateSlots.slots) {
    const comboSlotResult = processFirstSlot(firstSlot, slotsData, comboServices, date)

    if (comboSlotResult) {
      const alreadyExists = result.some((r) => r.time === comboSlotResult.time)
      if (!alreadyExists) {
        result.push(comboSlotResult)
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

  const endMonth = addMonths(today, 3)
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
