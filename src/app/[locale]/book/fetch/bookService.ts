import { Noona } from 'lib/api'

export interface IBookService {
  title: string
  minutes: number
  id: string
  variations: { prices: { amount: number }[] }[]
}

export interface IBookServiceGroup {
  group_event_types: IBookService[]
  title: string
}
export const getBookService = async () => {
  const queryString = new URLSearchParams()

  const queryParams: Record<string, string | string[]> = {
    select: ['title', 'group_event_types'],
  }

  Object.entries(queryParams).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((val) => queryString.append(key, val))
    } else {
      queryString.append(key, value.toString())
    }
  })

  const data = await Noona.get(
    `/companies/8qcJwRg6dbNh6Gqvm/event_types/expanded?${queryString.toString()}`,
  )
  return data.data
}
