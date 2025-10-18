import qs from 'qs'

import { Axios } from '../lib/api'

export interface IDataHomepageService {
  shortTitle: string
  slug: string
}

export interface IDataFullService {
  title: string
  dynamicContent: any[]
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
  // Используем массив populate для явного указания путей
  const params = {
    filters: {
      slug: {
        $eq: slug,
      },
    },
    'populate[0]': 'dynamicContent',
    'populate[1]': 'dynamicContent.pricelistTable',
    'populate[2]': 'dynamicContent.pricelistTable.table',
    'populate[3]': 'dynamicContent.pricelistTable.table.item',
    'populate[4]': 'dynamicContent.cta',
    'populate[5]': 'dynamicContent.image',
    'populate[6]': 'dynamicContent.item',
  }

  const query = qs.stringify(params, {
    encodeValuesOnly: true,
  })

  const dataContact: IDataFullService[] = await Axios.get(`/api/services?${query}`)

  if (!dataContact || dataContact.length === 0) {
    throw new Error(`Service not found: ${slug}`)
  }

  return dataContact[0]
}
