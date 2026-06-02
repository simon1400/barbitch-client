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

  // Ответ тяжёлый (~2 МБ, все услуги) — на медленном мобильном соединении глобальные
  // 15с Noona не хватает. Поднимаем таймаут только для этого запроса до 30с.
  const data = await Noona.get(
    `/companies/${NOONA_COMPANY_ID}/event_types/expanded?${queryString.toString()}`,
    { timeout: 30_000 },
  )
  return data.data
}
