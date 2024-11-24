import qs from 'qs'

import { Axios } from '../lib/api'

export interface INavItem {
  title: string
  link: string
}

export interface IDataNav {
  leftNav: INavItem[]
  rightNav: INavItem[]
}
const query = qs.stringify(
  {
    populate: ['leftNav', 'rightNav'],
  },
  {
    encodeValuesOnly: true, // prettify URL
  },
)

export const getNav = async () => {
  const dataNav: IDataNav = await Axios.get(`/api/navigation?${query}`)

  return dataNav
}
