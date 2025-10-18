import { Axios } from 'lib/api'
import qs from 'qs'

const query = qs.stringify(
  {
    populate: {
      metaData: {
        populate: {
          image: {
            fields: ['url'],
          },
        },
      },
    },
  },
  {
    encodeValuesOnly: true, // prettify URL
  },
)

export const getHomeMeta = async () => {
  const data: IDataMetaWrap = await Axios.get(`/api/homepage?${query}`)

  return data
}

export const getVoucherMeta = async () => {
  const data: IDataMetaWrap = await Axios.get(`/api/vaucher-page?${query}`)

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
      populate: {
        metaData: {
          populate: {
            image: {
              fields: ['url'],
            },
          },
        },
      },
    },
    {
      encodeValuesOnly: true, // prettify URL
    },
  )
  const data: IDataMetaWrap[] = await Axios.get(`/api/blogs?${queryIn}`)

  return data[0]
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

  if (!data || data.length === 0) {
    throw new Error(`Service not found: ${slug}`)
  }

  return data[0]
}
