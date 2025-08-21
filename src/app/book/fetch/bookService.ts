import { Noona } from 'lib/api'

const NOONA_COMPANY_ID = process.env.NOONA_COMPANY_ID || ''

export interface IBookService {
  title: string
  minutes: number
  id: string
  variations: { prices: { amount: number }[] }[]
  images: { image: string }[]
  description: string
}

export interface IBookServiceGroup {
  group_event_types: IBookService[]
  title: string
}
export const getBookService = async () => {
  const queryString = new URLSearchParams()

  const queryParams: Record<string, string | string[]> = {
    select: ['title', 'group_event_types', 'image', 'description'],
  }

  Object.entries(queryParams).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((val) => queryString.append(key, val))
    } else {
      queryString.append(key, value.toString())
    }
  })

  const data = await Noona.get(
    `/companies/${NOONA_COMPANY_ID}/event_types/expanded?${queryString.toString()}`,
  )
  return data.data
}
