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

export const getPost = async (slug: string) => {
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
      encodeValuesOnly: true, // prettify URL
    },
  )

  const data: IDataPost[] = await Axios.get(`/api/blogs?${query}`)
  return data[0]
}

export const getAllPost = async () => {
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
      encodeValuesOnly: true, // prettify URL
    },
  )

  const data: IDataPostShort[] = await Axios.get(`/api/blogs?${query}`)
  return data
}

export const getRandomPost = async () => {
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
      encodeValuesOnly: true, // prettify URL
    },
  )

  const data: IDataPostShort[] = await Axios.get(`/api/blogs?${query}`)
  return data
}

export const getBlogPage = async () => {
  const queryPage = qs.stringify(
    {
      fields: ['title'],
    },
    {
      encodeValuesOnly: true, // prettify URL
    },
  )
  const data: IDataBlogPage = await Axios.get(`/api/blog-page?${queryPage}`)

  return data
}
