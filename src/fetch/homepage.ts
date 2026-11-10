import qs from 'qs'

import { Axios } from '../lib/api'

export interface IDataHomepage {
  title: string
  aboutUs: string
  galery: IGalery[]
}

const query = qs.stringify(
  {
    fields: ['title', 'aboutUs'],
    populate: {
      galery: {
        fields: ['hash', 'url', 'alternativeText'],
      },
    },
  },
  {
    encodeValuesOnly: true,
  },
)

export const getHomepage = async (): Promise<IDataHomepage> => {
  try {
    const data: IDataHomepage = await Axios.get(`/api/homepage?${query}`)
    return data
  } catch (error) {
    console.error('Failed to fetch homepage:', error)
    return { title: '', aboutUs: '', galery: [] }
  }
}

/** Fotka galerie „Naše práce“ (komponenta `content.galery-item` na homepage). */
export interface IGalleryItem {
  image: IGalery
  service?: { title: string; shortTitle?: string; slug: string } | null
  caption?: string | null
  /** Sekce /book, kterou otevře „Rezervovat“ (viz `lib/bookSection`); prázdné = podle služby. */
  bookingSection?: string | null
  /** Vlastní text v prohlížeči; prázdné = výchozí věta. */
  description?: string | null
  active?: boolean | null
}

const galleryQuery = qs.stringify(
  {
    fields: ['title'],
    populate: {
      galleryItems: {
        populate: {
          image: { fields: ['url', 'alternativeText', 'width', 'height'] },
          service: { fields: ['title', 'shortTitle', 'slug'] },
        },
      },
    },
  },
  {
    encodeValuesOnly: true,
  },
)

/**
 * Nová galerie s tagy služeb. Samostatný požadavek: dokud Strapi pole
 * `galleryItems` nezná (400 „Invalid key“), nesmí to shodit titulek a „O nás“
 * z `getHomepage()` — galerie pak spadne zpět na staré pole `galery`.
 */
export const getGalleryItems = async (): Promise<IGalleryItem[]> => {
  try {
    const data: { galleryItems?: IGalleryItem[] | null } = await Axios.get(
      `/api/homepage?${galleryQuery}`,
    )
    return (data.galleryItems || []).filter(
      (item) => item.active !== false && item.image?.url?.startsWith('http'),
    )
  } catch (error) {
    console.error('Failed to fetch homepage gallery:', error)
    return []
  }
}
