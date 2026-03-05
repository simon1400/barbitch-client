import qs from 'qs'

import { Axios } from '../lib/api'

export interface IDataPost {
  title: string
  image: IGalery
  dynamicContent: any[]
  publishedAt?: string
  updatedAt?: string
}

export interface IDataPostShort {
  title: string
  slug: string
  image: IGalery
  contentText?: string
}

interface IDataBlogPage {
  title: string
}

export const getPost = async (slug: string): Promise<IDataPost | undefined> => {
  const query = qs.stringify(
    {
      filters: {
        slug: {
          $eq: slug,
        },
      },
      fields: ['title', 'publishedAt', 'updatedAt'],
      populate: {
        image: {
          fields: ['url', 'alternativeText'],
        },
        dynamicContent: {
          on: {
            'content.text': {
              populate: '*',
            },
            'content.content-baner': {
              populate: {
                cta: {
                  fields: ['title', 'link'],
                },
                image: {
                  fields: ['url', 'alternativeText'],
                },
              },
            },
            'content.galery': {
              populate: {
                image: {
                  fields: ['url', 'alternativeText'],
                },
              },
            },
            'content.faq': {
              populate: '*',
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
    const data: IDataPost[] = await Axios.get(`/api/blogs?${query}`)
    return data[0]
  } catch (error) {
    console.error('Failed to fetch post:', error)
    return undefined
  }
}

export const getAllPost = async (): Promise<IDataPostShort[]> => {
  const query = qs.stringify(
    {
      fields: ['title', 'slug'],
      populate: {
        image: {
          fields: ['url', 'alternativeText'],
        },
      },
    },
    {
      encodeValuesOnly: true,
    },
  )

  try {
    const data: IDataPostShort[] = await Axios.get(`/api/blogs?${query}`)
    return data
  } catch (error) {
    console.error('Failed to fetch all posts:', error)
    return []
  }
}

export const getRandomPost = async (): Promise<IDataPostShort[]> => {
  const query = qs.stringify(
    {
      fields: ['title', 'slug'],
      populate: {
        image: {
          fields: ['url', 'alternativeText'],
        },
      },
      sort: ['createdAt:desc'],
      pagination: {
        start: 0,
        limit: 3,
      },
    },
    {
      encodeValuesOnly: true,
    },
  )

  try {
    const data: IDataPostShort[] = await Axios.get(`/api/blogs?${query}`)
    return data
  } catch (error) {
    console.error('Failed to fetch random posts:', error)
    return []
  }
}

export const getBlogPage = async (): Promise<IDataBlogPage> => {
  const queryPage = qs.stringify(
    {
      fields: ['title'],
    },
    {
      encodeValuesOnly: true,
    },
  )

  try {
    const data: IDataBlogPage = await Axios.get(`/api/blog-page?${queryPage}`)
    return data
  } catch (error) {
    console.error('Failed to fetch blog page:', error)
    return { title: '' }
  }
}
