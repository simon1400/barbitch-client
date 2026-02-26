import type { IAddonGroup } from 'app/book/fetch/addonGroupService'

import { Axios, Noona } from 'lib/api'

const NOONA_COMPANY_ID = process.env.NOONA_COMPANY_ID || ''

const DEEP_POPULATE =
  'populate[modifiers]=true&populate[base_modifier_results]=true&populate[addons][populate][modifier_results]=true'

export interface IPricelistService {
  id: string
  title: string
  minutes: number
  basePrice: number
  addonGroup?: IAddonGroup
}

export interface IPricelistGroup {
  title: string
  services: IPricelistService[]
}

interface AddonMaps {
  addonGroupMap: Map<string, IAddonGroup>
  hiddenIds: Set<string>
}

const collectHiddenIds = (ag: IAddonGroup, hiddenIds: Set<string>) => {
  for (const addon of ag.addons ?? []) {
    hiddenIds.add(addon.result_noona_id)
    for (const mr of addon.modifier_results ?? []) {
      hiddenIds.add(mr.result_noona_id)
    }
  }
  for (const bmr of ag.base_modifier_results ?? []) {
    hiddenIds.add(bmr.result_noona_id)
  }
}

const buildAddonMaps = (addonGroups: IAddonGroup[]): AddonMaps => {
  const addonGroupMap = new Map<string, IAddonGroup>()
  const hiddenIds = new Set<string>()
  for (const ag of addonGroups) {
    addonGroupMap.set(ag.base_noona_id, ag)
    collectHiddenIds(ag, hiddenIds)
  }
  return { addonGroupMap, hiddenIds }
}

const buildServices = (
  noonaGroup: { group_event_types: any[] },
  addonGroupMap: Map<string, IAddonGroup>,
  hiddenIds: Set<string>,
): IPricelistService[] => {
  const services: IPricelistService[] = []
  for (const service of noonaGroup.group_event_types ?? []) {
    if (hiddenIds.has(service.id.toString())) continue
    const noonaPrice = service.variations?.[0]?.prices?.[0]?.amount ?? 0
    const addonGroup = addonGroupMap.get(service.id.toString())
    services.push({
      id: service.id.toString(),
      title: service.title,
      minutes: service.minutes,
      basePrice: addonGroup?.base_price ?? noonaPrice,
      addonGroup,
    })
  }
  return services
}

export const getBookingPricelist = async (): Promise<IPricelistGroup[]> => {
  const queryString = 'select=title&select=group_event_types&select=description'

  const [noonaResponse, addonGroups] = await Promise.all([
    Noona.get(`/companies/${NOONA_COMPANY_ID}/event_types/expanded?${queryString}`).catch(() => ({
      data: [],
    })),
    (Axios.get(`/api/booking-addon-groups?${DEEP_POPULATE}`) as Promise<IAddonGroup[]>).catch(
      () => [] as IAddonGroup[],
    ),
  ])

  const noonaData: { title: string; group_event_types: any[] }[] = noonaResponse.data ?? []
  const { addonGroupMap, hiddenIds } = buildAddonMaps(Array.isArray(addonGroups) ? addonGroups : [])

  const result: IPricelistGroup[] = []
  for (const group of noonaData) {
    const services = buildServices(group, addonGroupMap, hiddenIds)
    if (services.length > 0) result.push({ title: group.title, services })
  }
  return result
}
