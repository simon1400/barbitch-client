/**
 * Sekce rezervace (/book) — skupiny katalogu enginu (`salon-service.category`).
 *
 * Galerie „Naše práce“ posílá na `/book?sekce=<klíč>`, katalog podle klíče
 * rozbalí odpovídající skupinu. Názvy skupin jsou volný text s emoji
 * („Řasy – barvení a péče ☁️“), proto se páruje podle normalizovaného
 * začátku názvu, ne přesnou shodou. Nenalezená sekce = obyčejný katalog.
 */

/** Hodnoty pole `content.galery-item.bookingSection` ve Strapi. */
export type BookSection = 'Nehty' | 'Oboci' | 'Rasy_barveni_a_pece' | 'Prodluzovani_ras'

export const BOOK_SECTION_PARAM = 'sekce'

/** Začátky normalizovaných názvů skupin (bez diakritiky, emoji a interpunkce). */
const GROUP_PREFIXES: Record<BookSection, string[]> = {
  Nehty: ['nehty', 'manikura'],
  Oboci: ['oboci'],
  Rasy_barveni_a_pece: ['rasy barveni', 'barveni ras', 'lash lifting'],
  Prodluzovani_ras: ['prodluzovani ras', 'prodlouzeni ras'],
}

/** Služba z galerie bez vlastní sekce → nejčastější sekce té služby. */
const BY_SERVICE_SLUG: Record<string, BookSection> = {
  manikura: 'Nehty',
  oboci: 'Oboci',
  rasy: 'Prodluzovani_ras',
}

/** 4. pád pro tlačítko „Rezervovat …“. */
const SECTION_ACC: Record<BookSection, string> = {
  Nehty: 'manikúru',
  Oboci: 'obočí',
  Rasy_barveni_a_pece: 'lash lifting',
  Prodluzovani_ras: 'prodloužení řas',
}

export const isBookSection = (v: unknown): v is BookSection =>
  typeof v === 'string' && Object.hasOwn(GROUP_PREFIXES, v)

export const normalizeGroupTitle = (title: string) =>
  title
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()

/** Název skupiny katalogu pro sekci, nebo `null`. */
export const findBookGroup = (titles: string[], section: BookSection): string | null => {
  const prefixes = GROUP_PREFIXES[section]
  return titles.find((t) => prefixes.some((p) => normalizeGroupTitle(t).startsWith(p))) ?? null
}

/** Sekce fotky: vlastní ze Strapi, jinak podle služby. */
export const resolveBookSection = (
  own: string | null | undefined,
  serviceSlug?: string,
): BookSection | null => {
  if (isBookSection(own)) return own
  return (serviceSlug && BY_SERVICE_SLUG[serviceSlug]) || null
}

export const bookSectionLabel = (section: BookSection | null) =>
  section ? `Rezervovat ${SECTION_ACC[section]}` : 'Rezervovat termín'

/**
 * Odkaz na rezervaci s rozbalenou sekcí. Jen pro vlastní `/book`
 * (relativní nebo barbitch.cz); cizí odkaz se nemění.
 */
export const bookSectionHref = (linkToReserve: string, section: BookSection | null) => {
  if (!section) return linkToReserve
  try {
    const url = new URL(linkToReserve, 'https://barbitch.cz')
    const own = url.hostname.endsWith('barbitch.cz') && url.pathname.replace(/\/$/, '') === '/book'
    if (!own) return linkToReserve
    url.searchParams.set(BOOK_SECTION_PARAM, section)
    return linkToReserve.startsWith('/') ? `${url.pathname}${url.search}` : url.toString()
  } catch {
    return linkToReserve
  }
}
