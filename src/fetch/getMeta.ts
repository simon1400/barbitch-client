import { Axios } from 'lib/api'
import qs from 'qs'

const query = qs.stringify(
  {
    populate: ['metaData'],
  },
  {
    encodeValuesOnly: true, // prettify URL
  },
)

export const getHomeMeta = async () => {
  const data: IDataMetaWrap = await Axios.get(`/api/homepage?${query}`)

  return data
}

export const getPricelistMeta = async () => {
  const data: IDataMetaWrap = await Axios.get(`/api/pricelist-page?${query}`)

  return data
}
