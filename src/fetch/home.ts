import axios from 'axios'
import qs from 'qs'

import { Axios } from '../lib/api'

/**
 * Data nové hlavní stránky (s286). Každý dotaz zvlášť a s náhradou: dokud Strapi
 * nová pole nezná (400 „Invalid key“) nebo ruční endpointy enginu neexistují
 * (404), stránka běží na výchozích textech v kódu — chyba jednoho dotazu nesmí
 * shodit titulek, galerii ani ostatní sekce (lekce s282).
 */

const apiUrl =
  process.env.NEXT_PUBLIC_APP_API || process.env.APP_API || 'https://strapi.barbitch.cz'

// Engine vrací ploché tělo bez obálky `{ data }` — vlastní instance bez interceptoru.
const Engine = axios.create({ baseURL: apiUrl, timeout: 10000 })

export interface IHomeImage {
  url: string
  width?: number
  height?: number
  alternativeText?: string | null
}

export interface IWhyItem {
  title: string
  text?: string | null
  linkLabel?: string | null
  linkUrl?: string | null
}

export interface IFaqItem {
  title: string
  /** HTML z CKEditoru; může obsahovat značky cen `{cena:manikura}` (viz lib/homeFaq). */
  content: string
}

interface IHomeContent {
  seoTitle?: string | null
  lead?: string | null
  heroImage?: IHomeImage | null
  heroImageMobile?: IHomeImage | null
  servicesTitle?: string | null
  whyItems?: IWhyItem[] | null
  faq?: IFaqItem[] | null
  aboutTitle?: string | null
}

const homeContentQuery = qs.stringify(
  {
    fields: ['seoTitle', 'lead', 'servicesTitle', 'aboutTitle'],
    populate: {
      heroImage: { fields: ['url', 'width', 'height', 'alternativeText'] },
      heroImageMobile: { fields: ['url', 'width', 'height', 'alternativeText'] },
      whyItems: true,
      faq: true,
    },
  },
  { encodeValuesOnly: true },
)

export const getHomeContent = async (): Promise<IHomeContent> => {
  try {
    const data: IHomeContent = await Axios.get(`/api/homepage?${homeContentQuery}`)
    return data || {}
  } catch (error) {
    console.error('Failed to fetch homepage content (s286 fields):', error)
    return {}
  }
}

/** Tři služby webu (kolekce `service`) s textem pro sekci s rukou. */
export interface IHomeService {
  title?: string
  shortTitle: string
  slug: string
  homeText?: string | null
}

const servicesQuery = (withHomeText: boolean) =>
  qs.stringify(
    {
      fields: withHomeText
        ? ['title', 'shortTitle', 'slug', 'homeText']
        : ['title', 'shortTitle', 'slug'],
    },
    { encodeValuesOnly: true },
  )

export const getHomeServices = async (): Promise<IHomeService[]> => {
  try {
    return (await Axios.get(`/api/services?${servicesQuery(true)}`)) || []
  } catch {
    // starý Strapi bez `homeText` → aspoň slugy, texty dodá kód
    try {
      return (await Axios.get(`/api/services?${servicesQuery(false)}`)) || []
    } catch (error) {
      console.error('Failed to fetch home services:', error)
      return []
    }
  }
}

// ── engine ──

export interface IPopularService {
  id: string
  title: string
  category: string
  price: number
  from: boolean
  durationMin: number | null
  bookingSection: string | null
  bookHref: string
}

export const getPopularServices = async (limit = 4): Promise<IPopularService[]> => {
  try {
    const { data } = await Engine.get<{ services?: IPopularService[] }>(
      `/api/engine/home/popular-services?limit=${limit}`,
    )
    return Array.isArray(data?.services) ? data.services : []
  } catch (error) {
    console.error('Failed to fetch popular services:', error)
    return []
  }
}

export interface IServicePrices {
  manikura: number | null
  oboci: number | null
  rasy: number | null
}

const EMPTY_PRICES: IServicePrices = { manikura: null, oboci: null, rasy: null }

export const getServicePrices = async (): Promise<IServicePrices> => {
  try {
    const { data } = await Engine.get<IServicePrices>('/api/engine/home/service-prices')
    return { ...EMPTY_PRICES, ...(data || {}) }
  } catch (error) {
    console.error('Failed to fetch service prices:', error)
    return EMPTY_PRICES
  }
}

export interface ITeamMember {
  id: string
  name: string
  photo: { url: string; width: number | null; height: number | null } | null
  specialization: string
  bookHref: string
}

export const getTeam = async (): Promise<ITeamMember[]> => {
  try {
    const { data } = await Engine.get<{ team?: ITeamMember[] }>('/api/engine/home/team')
    return Array.isArray(data?.team) ? data.team : []
  } catch (error) {
    console.error('Failed to fetch team:', error)
    return []
  }
}

interface ICatalogPrice {
  title: string
  price: number
}

/** Základní ceny veřejného katalogu enginu (ceník /book) — pro FAQ a JSON-LD. */
export const getCatalogPrices = async (): Promise<ICatalogPrice[]> => {
  try {
    const { data } = await Engine.get<{
      groups?: { services?: { title?: string; price?: number }[] }[]
    }>('/api/engine/services')
    return (data?.groups || [])
      .flatMap((g) => g.services || [])
      .map((s) => ({ title: String(s.title || ''), price: Number(s.price) || 0 }))
      .filter((s) => s.title && s.price > 0)
  } catch (error) {
    console.error('Failed to fetch catalog prices:', error)
    return []
  }
}

/** Rozpětí cen pro JSON-LD `priceRange` („300 CZK - 2090 CZK“). */
export const priceRangeOf = (catalog: ICatalogPrice[]): string | null => {
  if (!catalog.length) return null
  const prices = catalog.map((s) => s.price)
  return `${Math.min(...prices)} CZK - ${Math.max(...prices)} CZK`
}
