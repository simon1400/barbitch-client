import { Noona } from 'lib/api'

export interface ISlotReservationReqData {
  company: string
  event_types: string[]
  starts_at: string
  employee: string
}

export const createSlotReservation = async (body: ISlotReservationReqData) => {
  const reqData: any = body

  const data = await Noona.post(`/time_slot_reservations`, reqData)

  return data.data
}

export const getSlotReservation = async (id: string) => {
  const queryString = new URLSearchParams()

  const queryParams = {
    expand: 'employee',
    select: [
      'event_types.minutes',
      'event_types.title',
      'event_types.payments.total_payment',
      'starts_at',
      'employee.id',
      'employee.profile.name',
      'employee.',
    ],
  }

  Object.entries(queryParams).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((val) => queryString.append(key, val))
    } else {
      queryString.append(key, value.toString())
    }
  })

  const data = await Noona.get(`/time_slot_reservations/${id}?${queryString.toString()}`)

  return data.data
}
