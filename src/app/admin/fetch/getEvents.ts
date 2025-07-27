import { isBefore, isEqual, parseISO } from 'date-fns'
import { getMonthRange } from 'helpers/getMounthRange'
import { NoonaHQ } from 'lib/api'

interface EventItem {
  status?: string
  event_types: { color?: string }[]
  [key: string]: any
}

export const splitEventsByStatus = (events: EventItem[]) => {
  const cancelled: EventItem[] = []
  const noshow: EventItem[] = []
  const others: EventItem[] = []

  for (const event of events) {
    if (event.status === 'cancelled') {
      cancelled.push(event)
    } else if (event.status === 'noshow') {
      noshow.push(event)
    } else {
      others.push(event)
    }
  }

  return { cancelled, noshow, others }
}

export const groupByColor = (events: EventItem[]) => {
  const groups: Record<string, EventItem[]> = {}

  for (const event of events) {
    const color = event.event_types?.[0]?.color || 'unknown'
    if (!groups[color]) {
      groups[color] = []
    }
    groups[color].push(event)
  }

  return groups
}

export const getEvents = async (month: number) => {
  const { firstDay, lastDay } = getMonthRange(2025, month)
  const queryString = new URLSearchParams()

  const queryParams: Record<string, string | string[]> = {
    select: ['id', 'event_types.color', 'customer_name', 'status', 'ends_at'],
    filter: JSON.stringify({
      from: firstDay.toISOString(),
      to: lastDay.toISOString(),
    }),
  }

  Object.entries(queryParams).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((val) => queryString.append(key, val))
    } else {
      queryString.append(key, String(value))
    }
  })

  const data = await NoonaHQ.get(`/8qcJwRg6dbNh6Gqvm/events?${queryString.toString()}`)
  const { cancelled, noshow, others } = splitEventsByStatus(data.data)
  const groupedByColor = groupByColor(others)

  const now = new Date()

  const filteredBeenPayed = groupedByColor['#FF787D'].filter((item) => {
    const date = parseISO(item.ends_at)
    return isBefore(date, now) || isEqual(date, now)
  })

  const queryStringMetric = new URLSearchParams()

  const queryParamsMetric: Record<string, string | string[]> = {
    filter: JSON.stringify({
      from: firstDay.toISOString(),
      to: lastDay.toISOString(),
    }),
  }

  Object.entries(queryParamsMetric).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((val) => queryStringMetric.append(key, val))
    } else {
      queryStringMetric.append(key, String(value))
    }
  })

  const dataMetrics = await NoonaHQ.get(
    `/8qcJwRg6dbNh6Gqvm/events_count?${queryStringMetric.toString()}`,
  )
  const result = {
    all: data.data.length,
    cancelled: cancelled?.length || 0,
    noshow: noshow?.length || 0,
    payed: groupedByColor['#FF787D']?.length || 0,
    pastPayed: filteredBeenPayed?.length || 0,
    free: groupedByColor['#3d4881']?.length || 0,
    personal: groupedByColor['#59c3b9']?.length || 0,
    fixed: groupedByColor['#822949']?.length || 0,
    dataMetrics: dataMetrics.data || [],
  }
  return result
}
