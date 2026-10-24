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
                cta: {
                  fields: ['title', 'link'],
                },
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

  // Bez odchycení by výpadek CMS shodil celý /darkovy-voucher do 500.
  try {
    const data: IDataVoucher = await Axios.get(`/api/vaucher-page?${query}`)
    return data
  } catch (error) {
    console.error('Failed to fetch voucher page:', error)
    return { title: 'Dárkový voucher', dynamicContent: [] } satisfies IDataVoucher
  }
}

/** Karta voucheru na službu, jak ji skládá Strapi (GET /api/vaucher-page/service-vouchers). */
export interface IServiceVoucher {
  id: string
  serviceId: string
  tag: string
  name: string
  title: string
  desc: string
  photo: string | null
  price: number
}

// `null` = ručka nedostupná (starý server, výpadek) → web použije výchozí karty z kódu.
// Prázdné pole je platná odpověď: majitelka všechny karty vypnula.
export const getServiceVouchers = async (): Promise<IServiceVoucher[] | null> => {
  try {
    const data: IServiceVoucher[] = await Axios.get('/api/vaucher-page/service-vouchers')
    return Array.isArray(data) ? data : null
  } catch (error) {
    console.error('Failed to fetch service vouchers:', error)
    return null
  }
}
