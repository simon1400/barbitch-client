import { Axios } from 'lib/api'
import qs from 'qs'

interface IHomeMeta {
  metaData: IDataMeta
}

const query = qs.stringify(
  {
    populate: ['metaData'],
  },
  {
    encodeValuesOnly: true, // prettify URL
  },
)

export const getHomeMeta = async () => {
  const data: IHomeMeta = await Axios.get(`/api/homepage?${query}`)

  return data
}
