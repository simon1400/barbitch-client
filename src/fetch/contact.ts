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
}

export interface IDataLinkToReserve {
  linkToReserve: string
}

const query = qs.stringify(
  {
    fields: ['phone', 'email', 'openHours', 'address', 'linkToMap', 'linkToReserve'],
    populate: ['socItems'],
  },
  {
    encodeValuesOnly: true, // prettify URL
  },
)

export const getContact = async () => {
  const dataContact: IDataContact = await Axios.get(`/api/contact?${query}`)
  return dataContact
}

const queryLink = qs.stringify(
  {
    fields: ['linkToReserve'],
  },
  {
    encodeValuesOnly: true, // prettify URL
  },
)

export const getLinkToReserve = async () => {
  const data: IDataLinkToReserve = await Axios.get(`/api/contact?${queryLink}`)
  return data
}
