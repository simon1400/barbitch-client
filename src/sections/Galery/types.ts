import type { BookSection } from 'lib/bookSection'

/** Fotka připravená pro lentu a prohlížeč (bez ohledu na to, z jakého pole Strapi přišla). */
export interface GalleryPhoto {
  /** Stabilní klíč pro React (pořadí v celé galerii + URL). */
  key: string
  url: string
  alt: string
  /** Nadpis v prohlížeči: popisek → název služby → „Naše práce“. */
  caption: string
  /** Text pod nadpisem v prohlížeči (vlastní ze Strapi nebo výchozí). */
  text: string
  service: { title: string; slug: string } | null
  /** Sekce rezervace pro tlačítko „Rezervovat“ (vlastní nebo podle služby). */
  bookSection: BookSection | null
}

export interface GalleryChip {
  slug: string
  label: string
}

/**
 * Tlačítko „Ceník manikúry“ (2. pád). Neznámá služba → „Ceník“.
 * „Rezervovat …“ se skládá podle sekce rezervace — `bookSectionLabel`.
 */
const SERVICE_GEN: Record<string, string> = {
  manikura: 'manikúry',
  rasy: 'řas',
  oboci: 'obočí',
}

export const pricelistLabel = (slug?: string) => {
  const gen = slug ? SERVICE_GEN[slug] : undefined
  return gen ? `Ceník ${gen}` : 'Ceník'
}

/** Výchozí text v prohlížeči, když fotka nemá vlastní popis. */
export const DEFAULT_PHOTO_TEXT =
  'Líbí se vám tenhle výsledek? Vyberte si termín a napište nám do poznámky, že chcete něco podobného.'

/** „01“, „12“ — čísla karet a počítadlo. */
export const pad2 = (n: number) => String(n).padStart(2, '0')
