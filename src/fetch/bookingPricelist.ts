import type { IEngineModifier, IEngineVariant } from 'app/book/fetch/engine'

import { getEngineCatalog } from 'app/book/fetch/engine'
import { cache } from 'react'

// Прайс-лист (/cenik + /service/* через PriceList) читает собственный каталог
// движка (GET /api/engine/services) — к Noona отсюда обращений НЕТ.
// Каталог отдаёт только active+onlineBookable услуги, сгруппированные по
// категориям, — ровно то, что раньше давал Noona-фетч после фильтрации
// combo/junior (hiddenIds/juniorIds больше не нужны по построению).

export interface IPricelistService {
  id: string
  title: string
  minutes: number
  basePrice: number
  variants: IEngineVariant[]
  modifiers: IEngineModifier[]
}

export interface IPricelistGroup {
  title: string
  services: IPricelistService[]
}

// cache() dedupuje volání v rámci jednoho requestu — service stránka volá tuto
// funkci pro schema cen i přes PriceList (DynamicContent) → jen jeden fetch.
export const getBookingPricelist = cache(async (): Promise<IPricelistGroup[]> => {
  const groups = await getEngineCatalog().catch(() => [])

  const result: IPricelistGroup[] = []
  for (const group of groups) {
    const services: IPricelistService[] = (group.services ?? []).map((s) => ({
      id: s.id,
      title: s.title,
      minutes: s.durationMin,
      basePrice: s.price,
      variants: s.variants ?? [],
      modifiers: s.modifiers ?? [],
    }))
    if (services.length > 0) result.push({ title: group.title, services })
  }
  return result
})
