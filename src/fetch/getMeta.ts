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
    encodeValuesOnly: true,
  },
)

const defaultMeta: IDataMetaWrap = {
  title: '',
  metaData: { title: '', description: '', image: { url: '' } },
}

export const getHomeMeta = async (): Promise<IDataMetaWrap> => {
  try {
    const data: IDataMetaWrap = await Axios.get(`/api/homepage?${query}`)
    return data
  } catch (error) {
    console.error('Failed to fetch home meta:', error)
    return defaultMeta
  }
}

export const getVoucherMeta = async (): Promise<IDataMetaWrap> => {
  try {
    const data: IDataMetaWrap = await Axios.get(`/api/vaucher-page?${query}`)
    return data
  } catch (error) {
    console.error('Failed to fetch voucher meta:', error)
    return defaultMeta
  }
}

export const getPricelistMeta = async (): Promise<IDataMetaWrap> => {
  try {
    const data: IDataMetaWrap = await Axios.get(`/api/pricelist-page?${query}`)
    return data
  } catch (error) {
    console.error('Failed to fetch pricelist meta:', error)
    return defaultMeta
  }
}

export const getBlogPageMeta = async (): Promise<IDataMetaWrap> => {
  try {
    const data: IDataMetaWrap = await Axios.get(`/api/blog-page?${query}`)
    return data
  } catch (error) {
    console.error('Failed to fetch blog page meta:', error)
    return defaultMeta
  }
}

export const getContactMeta = async (): Promise<IDataMetaWrap> => {
  try {
    const data: IDataMetaWrap = await Axios.get(`/api/contact?${query}`)
    return data
  } catch (error) {
    console.error('Failed to fetch contact meta:', error)
    return defaultMeta
  }
}

export const getPostMeta = async (slug: string): Promise<IDataMetaWrap | undefined> => {
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
      encodeValuesOnly: true,
    },
  )

  try {
    const data: IDataMetaWrap[] = await Axios.get(`/api/blogs?${queryIn}`)
    return data[0]
  } catch (error) {
    console.error('Failed to fetch post meta:', error)
    return undefined
  }
}

export const getFullServiceMeta = async (slug: string): Promise<IDataMetaWrap> => {
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
      encodeValuesOnly: true,
    },
  )

  try {
    const data: IDataMetaWrap[] = await Axios.get(`/api/services?${queryIn}`)
    if (!data || data.length === 0) {
      throw new Error(`Service not found: ${slug}`)
    }
    return data[0]
  } catch (error) {
    console.error('Failed to fetch service meta:', error)
    throw error
  }
}
