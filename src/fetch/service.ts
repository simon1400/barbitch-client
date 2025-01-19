import qs from 'qs'

import { Axios } from '../lib/api'

export interface IDataHomepageService {
  title: string
  slug: string
}

export interface IDataFullService {
  title: string
  description: string
  additionalDescription: string
  galery: {
    hash: string
    name: string
  }[]
}

const queryServiceHomepage = qs.stringify(
  {
    fields: ['title', 'slug'],
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

export const getFullServiceMeta = async (slug: string) => {
  const query = qs.stringify(
    {
      filters: {
        slug: {
          $eq: slug,
        },
      },
      fields: ['title'],
      populate: ['metaData'],
    },
    {
      encodeValuesOnly: true, // prettify URL
    },
  )

  const data: IDataMetaWrap[] = await Axios.get(`/api/services?${query}`)
  return data[0]
}
