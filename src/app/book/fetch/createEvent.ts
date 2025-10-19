import { Noona } from 'lib/api'

export interface IEventReqData {
  time_slot_reservation: string
  customer_name: string
  number_of_guests: number
  no_show_acknowledged: boolean
  email: string
  origin: string
  channel: string
  source: string
  phone_country_code: string
  phone_number: string
  comment: string
}

export class BlacklistError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'BlacklistError'
  }
}

export const createEvent = async (body: IEventReqData) => {
  const reqData: any = body

  try {
    const response = await Noona.post(`/events`, reqData)
    const data = response.data

    return data
  } catch (error: any) {
    // Check if error is related to blacklisted customer
    const errorMessage = error.response?.data?.message || error.message || ''
    const errorStatus = error.response?.status
    const errorData = error.response?.data

    // Noona returns 422 or 400 when customer is blacklisted
    // Check for blacklist-related error messages
    const isBlacklistError =
      errorStatus === 422 ||
      errorStatus === 400 ||
      errorStatus === 403 ||
      (errorMessage && errorMessage.toLowerCase().includes('blacklist')) ||
      (errorMessage && errorMessage.toLowerCase().includes('rejected')) ||
      (errorMessage && errorMessage.toLowerCase().includes('customer is blacklisted')) ||
      (errorMessage && errorMessage.toLowerCase().includes('not allowed')) ||
      (errorData?.error && errorData.error.toLowerCase().includes('blacklist'))

    if (isBlacklistError) {
      throw new BlacklistError('Customer is blacklisted')
    }

    // Re-throw other errors
    throw error
  }
}
