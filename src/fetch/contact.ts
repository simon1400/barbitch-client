import qs from 'qs'

import { Axios } from '../lib/api'

export interface ISocItem {
  link: string
  type: 'tiktok' | 'facebook' | 'instagram'
}

export interface IDataContact {
  phone: string
  email: string
  openHours?: string
  address?: string
  linkToMap?: string
  socItems?: ISocItem[]
  linkToReserve: string
  content: string
}

export interface IDataLinkToReserve {
  linkToReserve: string
}

const query = qs.stringify(
  {
    fields: ['phone', 'email', 'openHours', 'address', 'linkToMap', 'linkToReserve', 'content'],
    populate: ['socItems'],
  },
  {
    encodeValuesOnly: true,
  },
)

let cachedContact: IDataContact | null = null
let cacheTime = 0
const CACHE_TTL = 60_000

export const getContact = async (): Promise<IDataContact> => {
  const now = Date.now()
  if (cachedContact && now - cacheTime < CACHE_TTL) {
    return cachedContact
  }
  try {
    const data: IDataContact = await Axios.get(`/api/contact?${query}`)
    cachedContact = data
    cacheTime = now
    return data
  } catch (error) {
    console.error('Failed to fetch contact:', error)
    return cachedContact || ({} as IDataContact)
  }
}

export const getContactContent = async (): Promise<IDataContact> => {
  return getContact()
}

export const getLinkToReserve = async (): Promise<IDataLinkToReserve> => {
  const data = await getContact()
  return { linkToReserve: data.linkToReserve }
}
