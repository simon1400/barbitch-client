import qs from 'qs'

import { Axios } from '../lib/api'

export interface IDataVoucher {
  title: string
  dynamicContent: any[]
}

export const getVoucher = async () => {
  const query = qs.stringify(
    {
      fields: ['title'],
      populate: {
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

  const data: IDataVoucher = await Axios.get(`/api/vaucher-page?${query}`)
  return data
}

export const createVoucher = async (body: any) => {
  try {
    const res: any = await Axios.post('/api/vouchers', { data: body })
    return res
  } catch (error: any) {
    if (error.response) {
      console.error('❌ Error Status:', error.response.status)
      console.error('❌ Error Data:', error.response.data)
    } else if (error.request) {
      console.error('❌ No response received:', error.request)
    } else {
      console.error('❌ Request Error:', error.message)
    }
    throw error
  }
}
