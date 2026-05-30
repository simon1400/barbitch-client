import { Axios } from 'lib/api'

export interface IJuniorMap {
  senior_noona_id: string
  junior_noona_id: string
  title?: string
  senior_price?: number
  junior_price?: number
}

export interface IJuniorPersonal {
  noonaEmployeeId: string
  tier: 'senior' | 'junior'
}

/**
 * Загружает запись маппинга senior → junior для конкретного senior event_type ID.
 * Возвращает null если junior-копии нет.
 */
export const getJuniorMapForSenior = async (
  seniorNoonaId: string,
): Promise<IJuniorMap | null> => {
  try {
    const data: any[] = await Axios.get(
      `/api/service-junior-maps?filters[senior_noona_id][$eq]=${encodeURIComponent(seniorNoonaId)}&pagination[pageSize]=1`,
    )
    if (!Array.isArray(data) || data.length === 0) return null
    const item = data[0]
    if (!item?.senior_noona_id || !item?.junior_noona_id) return null
    return {
      senior_noona_id: item.senior_noona_id,
      junior_noona_id: item.junior_noona_id,
      title: item.title,
      senior_price: item.senior_price,
      junior_price: item.junior_price,
    }
  } catch {
    return null
  }
}

/**
 * Поиск маппинга по junior_noona_id — используется на финальной странице резервации,
 * чтобы понять что текущий event_type — это junior-вариант, и показать senior_price зачёркнутым.
 */
export const getJuniorMapByJuniorId = async (
  juniorNoonaId: string,
): Promise<IJuniorMap | null> => {
  try {
    const data: any[] = await Axios.get(
      `/api/service-junior-maps?filters[junior_noona_id][$eq]=${encodeURIComponent(juniorNoonaId)}&pagination[pageSize]=1`,
    )
    if (!Array.isArray(data) || data.length === 0) return null
    const item = data[0]
    if (!item?.senior_noona_id || !item?.junior_noona_id) return null
    return {
      senior_noona_id: item.senior_noona_id,
      junior_noona_id: item.junior_noona_id,
      title: item.title,
      senior_price: item.senior_price,
      junior_price: item.junior_price,
    }
  } catch {
    return null
  }
}

/**
 * Все junior_noona_id из маппинга. Используется на /book чтобы скрыть
 * junior-копии из основного списка услуг (они должны быть доступны только
 * через подмену event_type при выборе junior-мастера).
 */
const JUNIOR_MAP_PAGE_SIZE = 200

const fetchJuniorMapPage = async (page: number): Promise<any[]> => {
  try {
    const data = (await Axios.get(
      `/api/service-junior-maps?fields[0]=junior_noona_id&pagination[page]=${page}&pagination[pageSize]=${JUNIOR_MAP_PAGE_SIZE}`,
    )) as unknown as any[]
    return Array.isArray(data) ? data : []
  } catch {
    return []
  }
}

export const getJuniorNoonaIds = async (): Promise<Set<string>> => {
  // Страниц junior-маппингов сейчас ~4 (656 записей). Раньше грузились
  // последовательно (await в цикле) → ~5с к Supabase pooler. Грузим батчами
  // параллельно: один батч = ~1.3с вместо 4×1.3с. Батч из 5 страниц покрывает
  // до 1000 записей за один заход; если данных больше — берём следующий батч.
  const BATCH = 5
  const ids = new Set<string>()
  let start = 1

  while (true) {
    const pages = Array.from({ length: BATCH }, (_, i) => start + i)
    const results = await Promise.all(pages.map(fetchJuniorMapPage))

    for (const data of results) {
      for (const item of data) {
        if (item.junior_noona_id) ids.add(item.junior_noona_id)
      }
    }

    // Если последняя страница батча не заполнена — данных за этим батчем нет.
    if (results[results.length - 1].length < JUNIOR_MAP_PAGE_SIZE) break
    start += BATCH
  }

  return ids
}

/**
 * Все активные personal с их tier (senior/junior) и noonaEmployeeId.
 * Используется на странице выбора мастера, чтобы пометить junior бейджем.
 */
export const getJuniorPersonals = async (): Promise<IJuniorPersonal[]> => {
  try {
    const data: any[] = await Axios.get(
      '/api/personals?fields[0]=noonaEmployeeId&fields[1]=tier&filters[isActive][$eq]=true&filters[position][$eq]=master&pagination[pageSize]=100&status=published',
    )
    return (data || [])
      .filter((item: any) => item.noonaEmployeeId)
      .map((item: any) => ({
        noonaEmployeeId: item.noonaEmployeeId,
        tier: (item.tier === 'junior' ? 'junior' : 'senior') as 'senior' | 'junior',
      }))
  } catch {
    return []
  }
}
