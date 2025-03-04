import qs from 'qs'

import { Axios } from '../lib/api'

export interface IDataPost {
  title: string
  
  image: IGalery
  dynamicContent: any[]
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
      fields: ['title'],
      populate: {
        image: {
          fields: ['hash', 'url', 'alternativeText'],
        },
        dynamicContent: {
          on: {
            'content.text': {
              populate: '*',
            },
            'content.content-baner': {
              populate: '*',
            },
            'content.galery': {
              populate: {
                image: {
                  fields: ['url', 'hash', 'alternativeText'],
                },
              },
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
      fields: ['title', 'slug', 'contentText'],
      populate: {
        image: {
          fields: ['hash', 'url', 'alternativeText'],
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
          fields: ['hash', 'url', 'alternativeText'],
        },
      },
    },
    {
      encodeValuesOnly: true, // prettify URL
    },
  )

  const data: IDataPostShort[] = await Axios.get(`/api/blogs?${query}`)
  console.log(data)
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
