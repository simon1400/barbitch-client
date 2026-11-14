import qs from 'qs'

import { Axios } from '../lib/api'

export interface IDataPost {
  title: string
  image: IGalery
  dynamicContent: any[]
  publishedAt?: string
  updatedAt?: string
  metaData?: {
    title?: string
    description?: string
    image?: IGalery
  }
}

export interface IDataPostShort {
  title: string
  slug: string
  image: IGalery
  contentText?: string
  /** Téma (nálepka) — volitelné pole `blog.topic` (s286). */
  topic?: string | null
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
        metaData: {
          populate: ['image'],
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
      // Bez explicitního řazení a stránkování platil výchozí limit Strapi (25):
      // 26. článkem by nejstarší příspěvky tiše zmizely z /blog i ze sitemapy.
      sort: ['publishedAt:desc'],
      pagination: {
        start: 0,
        limit: 100,
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

/**
 * Tři nejnovější články pro hlavní stránku (s286) i s tématem. Pole `topic`
 * starý Strapi nezná (400) → druhý pokus bez něj, téma pak dopočítá `lib/blogTopic`.
 */
export const getHomePosts = async (): Promise<IDataPostShort[]> => {
  const query = (withTopic: boolean) =>
    qs.stringify(
      {
        fields: withTopic ? ['title', 'slug', 'topic'] : ['title', 'slug'],
        populate: { image: { fields: ['url', 'alternativeText', 'width', 'height'] } },
        sort: ['createdAt:desc'],
        pagination: { start: 0, limit: 3 },
      },
      { encodeValuesOnly: true },
    )
  try {
    return (await Axios.get(`/api/blogs?${query(true)}`)) || []
  } catch {
    try {
      return (await Axios.get(`/api/blogs?${query(false)}`)) || []
    } catch (error) {
      console.error('Failed to fetch home posts:', error)
      return []
    }
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
