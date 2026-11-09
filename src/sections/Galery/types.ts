/** Fotka připravená pro lentu a prohlížeč (bez ohledu na to, z jakého pole Strapi přišla). */
export interface GalleryPhoto {
  /** Stabilní klíč pro React (pořadí v celé galerii + URL). */
  key: string
  url: string
  alt: string
  /** Nadpis v prohlížeči: popisek → název služby → „Naše práce“. */
  caption: string
  service: { title: string; slug: string } | null
}

export interface GalleryChip {
  slug: string
  label: string
}

/**
 * Tlačítka v prohlížeči: „Rezervovat manikúru“ (4. pád) a „Ceník manikúry“ (2. pád).
 * Neznámá služba → obecné „Rezervovat termín“ / „Ceník“.
 */
const SERVICE_CASES: Record<string, { acc: string; gen: string }> = {
  manikura: { acc: 'manikúru', gen: 'manikúry' },
  rasy: { acc: 'řasy', gen: 'řas' },
  oboci: { acc: 'obočí', gen: 'obočí' },
}

export const reserveLabel = (slug?: string) => {
  const c = slug ? SERVICE_CASES[slug] : undefined
  return c ? `Rezervovat ${c.acc}` : 'Rezervovat termín'
}

export const pricelistLabel = (slug?: string) => {
  const c = slug ? SERVICE_CASES[slug] : undefined
  return c ? `Ceník ${c.gen}` : 'Ceník'
}

/** „01“, „12“ — čísla karet a počítadlo. */
export const pad2 = (n: number) => String(n).padStart(2, '0')
