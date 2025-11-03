import qs from 'qs'

import { Axios } from '../lib/api'

export interface IDataBanner {
  title: string
  animateLine1: IDataImage
  animateLine2: IDataImage
  animateLine3: IDataImage
  cta: IDataLink
}

const query = qs.stringify(
  {
    fields: ['title'],
    // populate: ['cta', 'animateLine1', 'animateLine2', 'animateLine3'],
    populate: {
      cta: {
        fields: ['link', 'title'],
      },
      animateLine1: {
        fields: ['url'],
      },
      animateLine2: {
        fields: ['url'],
      },
      animateLine3: {
        fields: ['url'],
      },
    },
  },
  {
    encodeValuesOnly: true, // prettify URL
  },
)

export const getBanner = async () => {
  const data: IDataBanner = await Axios.get(`/api/banner?${query}`)
  return data
}
