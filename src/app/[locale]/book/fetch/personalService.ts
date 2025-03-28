import { Noona } from 'lib/api'

const NOONA_COMPANY_ID = process.env.NOONA_COMPANY_ID || ''

export interface IPersonalService {
  id: string
  profile: {
    image: any
    name: string
  }
}

export const getPersonalService = async (id: string) => {
  const queryString = new URLSearchParams()

  const queryParams: Record<string, string | string[]> = {
    type: 'available',
    select: ['profile', 'id'],
    filter: JSON.stringify({ event_type_ids: [id] }),
  }

  Object.entries(queryParams).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((val) => queryString.append(key, val))
    } else {
      queryString.append(key, String(value))
    }
  })

  const data = await Noona.get(`/companies/${NOONA_COMPANY_ID}/employees?${queryString.toString()}`)

  return data.data
}
