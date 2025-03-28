import { Noona } from 'lib/api'

export interface IEventReqData {
  time_slot_reservation: string
  customer_name: string
  number_of_guests: number
  no_show_acknowledged: boolean
  email: string
  phone_country_code: string
  phone_number: string
  comment: string
}

export const createEvent = async (body: IEventReqData) => {
  const reqData: any = body

  const data = await Noona.post(`/events`, reqData)

  return data.data
}
