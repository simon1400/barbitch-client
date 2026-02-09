import qs from 'qs'

import { Axios } from '../lib/api'

export interface IDataArticle {
  title: string
  slug: string
  dynamicContent: any[]
}

export const getArticle = async (slug: string) => {
  const query = qs.stringify(
    {
      filters: {
        slug: {
          $eq: slug,
        },
      },
      fields: ['title'],
      populate: {
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
            'content.price-list': {
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

  const data: IDataArticle[] = await Axios.get(`/api/articles?${query}`)
  return data[0]
}

export const getArticleMeta = async (slug: string) => {
  const query = qs.stringify(
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

  const data: IDataMetaWrap[] = await Axios.get(`/api/articles?${query}`)
  return data[0]
}
