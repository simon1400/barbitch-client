import qs from 'qs'

import { Axios } from '../lib/api'

interface IDataHomepage {
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
    encodeValuesOnly: true, // prettify URL
  },
)

export const getHomepage = async () => {
  const data: IDataHomepage = await Axios.get(`/api/homepage?${query}`)
  return data
}
