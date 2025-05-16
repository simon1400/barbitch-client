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

const queryContactContent = qs.stringify(
  {
    fields: ['content'],
  },
  {
    encodeValuesOnly: true, // prettify URL
  },
)

export const getContactContent = async () => {
  const dataContact: IDataContact = await Axios.get(`/api/contact?${queryContactContent}`)
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
