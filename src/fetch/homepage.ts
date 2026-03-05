import qs from 'qs'

import { Axios } from '../lib/api'

export interface IDataHomepage {
  title: string
  aboutUs: string
  galery: IGalery[]
}

const query = qs.stringify(
  {
    fields: ['title', 'aboutUs'],
    populate: {
      galery: {
        fields: ['hash', 'url', 'alternativeText'],
      },
    },
  },
  {
    encodeValuesOnly: true,
  },
)

export const getHomepage = async (): Promise<IDataHomepage> => {
  try {
    const data: IDataHomepage = await Axios.get(`/api/homepage?${query}`)
    return data
  } catch (error) {
    console.error('Failed to fetch homepage:', error)
    return { title: '', aboutUs: '', galery: [] }
  }
}
