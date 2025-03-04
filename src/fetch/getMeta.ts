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
export const getBlogPageMeta = async () => {
  const data: IDataMetaWrap = await Axios.get(`/api/blog-page?${query}`)

  return data
}



export const getContactMeta = async () => {
  const data: IDataMetaWrap = await Axios.get(`/api/contact?${query}`)

  return data
}

export const getPostMeta = async (slug: string) => {
  const queryIn = qs.stringify(
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
  const data: IDataMetaWrap = await Axios.get(`/api/blog-page?${queryIn}`)

  return data
}

export const getFullServiceMeta = async (slug: string) => {
  const queryIn = qs.stringify(
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

  const data: IDataMetaWrap[] = await Axios.get(`/api/services?${queryIn}`)
  return data[0]
}
