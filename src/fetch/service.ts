import qs from 'qs'

import { Axios } from '../lib/api'

export interface IDataHomepageService {
  shortTitle: string
  slug: string
}

export interface IDataFullService {
  title: string
  description: string
  additionalDescription: string
  galery: {
    hash: string
    name: string
    url: string
  }[]
}

const queryServiceHomepage = qs.stringify(
  {
    fields: ['shortTitle', 'slug'],
  },
  {
    encodeValuesOnly: true, // prettify URL
  },
)

export const getServiceHomepage = async () => {
  const dataService: IDataHomepageService[] = await Axios.get(
    `/api/services?${queryServiceHomepage}`,
  )
  return dataService
}

export const getFullService = async (slug: string) => {
  const query = qs.stringify(
    {
      filters: {
        slug: {
          $eq: slug,
        },
      },
      fields: ['title', 'description', 'additionalDescription'],
      populate: ['galery'],
    },
    {
      encodeValuesOnly: true, // prettify URL
    },
  )

  const dataContact: IDataFullService[] = await Axios.get(`/api/services?${query}`)
  return dataContact[0]
}


