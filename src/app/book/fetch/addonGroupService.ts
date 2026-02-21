import { Axios } from 'lib/api'

export interface IModifierItem {
  key: string
  label: string
  price_diff: number
}

export interface IModifierResult {
  modifier_keys: string
  result_noona_id: string
}

export interface IAddonItem {
  label: string
  price_diff: number
  result_noona_id: string
  modifier_results: IModifierResult[]
}

export interface IAddonGroup {
  title: string
  base_noona_id: string
  base_price: number
  modifiers: IModifierItem[]
  base_modifier_results: IModifierResult[]
  addons: IAddonItem[]
}

const DEEP_POPULATE =
  'populate[modifiers]=true&populate[base_modifier_results]=true&populate[addons][populate][modifier_results]=true'

export const getAddonGroup = async (serviceId: string): Promise<IAddonGroup | null> => {
  try {
    const data = await Axios.get(
      `/api/booking-addon-groups?filters[base_noona_id][$eq]=${serviceId}&${DEEP_POPULATE}`,
    )
    if (!data || !Array.isArray(data) || data.length === 0) return null
    return data[0]
  } catch {
    return null
  }
}

export const getHiddenServiceIds = async (): Promise<Set<string>> => {
  try {
    const data = await Axios.get(
      `/api/booking-addon-groups?${DEEP_POPULATE}`,
    )
    if (!data || !Array.isArray(data)) return new Set()
    const ids = new Set<string>()
    for (const group of data as IAddonGroup[]) {
      for (const addon of group.addons ?? []) {
        ids.add(addon.result_noona_id)
        for (const mr of addon.modifier_results ?? []) {
          ids.add(mr.result_noona_id)
        }
      }
      for (const bmr of group.base_modifier_results ?? []) {
        ids.add(bmr.result_noona_id)
      }
    }
    return ids
  } catch {
    return new Set()
  }
}
