import qs from 'qs'

import { Axios } from '../lib/api'

export interface IDataService {
  title: string
  slug: string
}

const query = qs.stringify(
  {
    fields: ['title', 'slug'],
  },
  {
    encodeValuesOnly: true, // prettify URL
  },
)

export const getService = async () => {
  const dataService: IDataService[] = await Axios.get(`/api/services?${query}`)
  return dataService
}
