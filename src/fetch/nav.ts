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
    encodeValuesOnly: true,
  },
)

export const getNav = async (): Promise<IDataNav> => {
  try {
    const dataNav: IDataNav = await Axios.get(`/api/navigation?${query}`)
    return dataNav
  } catch (error) {
    console.error('Failed to fetch navigation:', error)
    return { leftNav: [], rightNav: [] }
  }
}
