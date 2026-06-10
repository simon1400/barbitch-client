import type { EmployeeLoad } from './masterPriority'

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
import { Noona, NoonaHQ } from 'lib/api'

import { getJuniorMapForSenior } from './juniorMap'
import { getPersonalService } from './personalService'

const NOONA_COMPANY_ID = process.env.NOONA_COMPANY_ID || ''

export interface ISlotService {
  date: string
  slots: {
    employeeIds: string[]
    time: string
  }[]
}

export interface IGetSlotServiceResult {
  executeDate: Date[]
  filteredData: ISlotService[]
  // employeeId → event_type для бронирования. Junior-мастера маппятся на
  // junior event_type (−20%), senior-мастера в карте отсутствуют (= serviceId).
  employeeEventTypeMap: Record<string, string>
  // employeeId → { дата: кол-во броней }. Используется для балансировки "Kdokoliv"
  // (наименее загруженный мастер). Пусто для конкретного мастера или при сбое HQ.
  employeeLoad: EmployeeLoad
}

export const filterFutureDates = (data: ISlotService[]) => {
  const today = startOfDay(new Date())

  return data.filter((item) => {
    const itemDate = startOfDay(parseISO(item.date))
    return isAfter(itemDate, today) || isEqual(itemDate, today)
  })
}

const buildDateRange = () => {
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

  return { start_date, end_date }
}

const fetchSlots = async (
  eventId: string,
  start_date: string,
  end_date: string,
  options: { employeeIds?: string[]; employeeId?: string },
): Promise<ISlotService[]> => {
  const queryParams: Record<string, any> = {
    start_date,
    end_date,
    event_type_ids: eventId,
    type: 'available',
    select: ['date', 'slots.employeeIds', 'slots.time'],
  }

  if (options.employeeIds) queryParams.employee_ids = options.employeeIds
  if (options.employeeId) queryParams.employee_id = options.employeeId

  const queryString = new URLSearchParams()
  Object.entries(queryParams).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((val) => queryString.append(key, String(val)))
    } else {
      queryString.append(key, String(value))
    }
  })

  const response = await Noona.get(
    `/companies/${NOONA_COMPANY_ID}/time_slots?${queryString.toString()}`,
  )

  return Array.isArray(response.data) ? response.data : []
}

// Объединяет слоты senior- и junior-event_type по дате+времени.
// Внутри одного времени списки employeeIds складываются (мастера разные).
const mergeSlots = (base: ISlotService[], extra: ISlotService[]): ISlotService[] => {
  const byDate = new Map<string, Map<string, Set<string>>>()
  const order: string[] = []

  const ingest = (data: ISlotService[]) => {
    for (const day of data) {
      if (!byDate.has(day.date)) {
        byDate.set(day.date, new Map())
        order.push(day.date)
      }
      const timeMap = byDate.get(day.date)!
      for (const slot of day.slots) {
        if (!timeMap.has(slot.time)) timeMap.set(slot.time, new Set())
        const empSet = timeMap.get(slot.time)!
        for (const id of slot.employeeIds) empSet.add(id)
      }
    }
  }

  ingest(base)
  ingest(extra)

  return order.map((date) => {
    const timeMap = byDate.get(date)!
    const slots = Array.from(timeMap.entries())
      .map(([time, empSet]) => ({ time, employeeIds: Array.from(empSet) }))
      .sort((a, b) => a.time.localeCompare(b.time))
    return { date, slots }
  })
}

// Загрузка мастеров (число активных броней по дням) из Noona HQ.
// Один запрос на мастера (их немного), параллельно. Сбой по любому мастеру
// не критичен — выбор просто откатится к приоритету.
const fetchEmployeeLoad = async (
  employeeIds: string[],
  start_date: string,
  end_date: string,
): Promise<EmployeeLoad> => {
  const result: EmployeeLoad = {}

  await Promise.all(
    employeeIds.map(async (id) => {
      try {
        const qs = new URLSearchParams()
        qs.append('select', 'starts_at')
        qs.append('select', 'ends_at')
        qs.append('select', 'status')
        qs.append(
          'filter',
          JSON.stringify({
            from: `${start_date}T00:00:00.000Z`,
            to: `${end_date}T23:59:59.999Z`,
            employee_id: id,
          }),
        )

        const res = await NoonaHQ.get(`/${NOONA_COMPANY_ID}/events?${qs.toString()}`)
        const events: any[] = Array.isArray(res.data) ? res.data : []

        const byDate: Record<string, number> = {}
        for (const ev of events) {
          if (ev.status === 'cancelled') continue
          const iso: string | undefined = ev.starts_at || ev.ends_at
          if (!iso) continue
          const day = iso.slice(0, 10) // 'yyyy-MM-dd'
          byDate[day] = (byDate[day] || 0) + 1
        }
        result[id] = byDate
      } catch {
        // загрузка не критична — оставляем мастера без данных (load = 0)
      }
    }),
  )

  return result
}

export const getSlotService = async (
  eventId: string,
  employeesId: string,
): Promise<IGetSlotServiceResult> => {
  const { start_date, end_date } = buildDateRange()

  // Конкретный мастер — поведение без изменений.
  if (employeesId !== 'any') {
    const data = await fetchSlots(eventId, start_date, end_date, { employeeId: employeesId })
    const filteredData = filterFutureDates(data)
    const executeDate = filteredData
      .filter((item) => !item.slots.length)
      .map((item) => parseISO(item.date))
    return { executeDate, filteredData, employeeEventTypeMap: {}, employeeLoad: {} }
  }

  // "Kdokoliv" — мержим senior + junior мастеров (если у услуги есть junior-копия).
  const [seniorEmployees, juniorMap] = await Promise.all([
    getPersonalService(eventId),
    getJuniorMapForSenior(eventId),
  ])

  const employeeEventTypeMap: Record<string, string> = {}
  let juniorIds: string[] = []

  if (juniorMap?.junior_noona_id) {
    const juniorEmployees = await getPersonalService(juniorMap.junior_noona_id)
    juniorIds = juniorEmployees.map((item: { id: string }) => item.id)
    for (const id of juniorIds) employeeEventTypeMap[id] = juniorMap.junior_noona_id
  }

  const juniorIdSet = new Set(juniorIds)
  // Junior-мастеров исключаем из senior-пула (как на странице выбора мастера),
  // чтобы они бронировались только через junior event_type (−20%).
  const seniorIds = seniorEmployees
    .map((item: { id: string }) => item.id)
    .filter((id: string) => !juniorIdSet.has(id))

  const loadIds = [...seniorIds, ...juniorIds]

  const [seniorSlots, juniorSlots, employeeLoad] = await Promise.all([
    seniorIds.length
      ? fetchSlots(eventId, start_date, end_date, { employeeIds: seniorIds })
      : Promise.resolve<ISlotService[]>([]),
    juniorIds.length && juniorMap
      ? fetchSlots(juniorMap.junior_noona_id, start_date, end_date, { employeeIds: juniorIds })
      : Promise.resolve<ISlotService[]>([]),
    loadIds.length
      ? fetchEmployeeLoad(loadIds, start_date, end_date)
      : Promise.resolve<EmployeeLoad>({}),
  ])

  const merged = juniorSlots.length ? mergeSlots(seniorSlots, juniorSlots) : seniorSlots
  const filteredData = filterFutureDates(merged)
  const executeDate = filteredData
    .filter((item) => !item.slots.length)
    .map((item) => parseISO(item.date))

  return { executeDate, filteredData, employeeEventTypeMap, employeeLoad }
}
