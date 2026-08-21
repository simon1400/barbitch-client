export const SITE_URL = 'https://barbitch.cz'

/**
 * Výchozí Open Graph / Twitter obrázek pro stránky, které nemají vlastní.
 * Stejný sociální banner, který se používá v rezervaci a voucheru.
 */
export const DEFAULT_OG_IMAGE = {
  url: '/assets/bigBaner.jpg',
  width: 1200,
  height: 630,
  alt: 'Barbitch Beauty Studio Brno',
} as const

/**
 * Absolutní URL pro JSON-LD.
 *
 * Relativní cesta (`/assets/…`) je ve strukturovaných datech nevalidní —
 * Google takové schéma zahodí celé. Všechny `image`/`url` ve schématech
 * musí projít tímto helperem.
 */
export const absUrl = (url: string | undefined | null): string | undefined => {
  if (!url) return undefined
  if (url.startsWith('http://') || url.startsWith('https://')) return url
  const path = url.startsWith('/') ? url : `/${url}`
  return `${SITE_URL}${path}`
}

/**
 * `dateModified` nesmí být starší než `datePublished` — Strapi ukládá
 * `updatedAt` o zlomek sekundy dřív než `publishedAt`, což v Article schématu
 * vypadá jako „upraveno před vydáním“.
 */
export const latestDate = (
  published: string | undefined,
  modified: string | undefined,
): string | undefined => {
  if (!published) return modified
  if (!modified) return published
  return new Date(modified) > new Date(published) ? modified : published
}

/** Google zobrazuje maximálně 110 znaků headline. */
export const clampHeadline = (title: string): string =>
  title.length > 110 ? `${title.slice(0, 109).trimEnd()}…` : title

/**
 * Titulek z CMS, který už obsahuje značku, nesmí projít šablonou `%s | Barbitch`
 * — jinak vznikne „Manikúra Brno … | Barbitch | Barbitch“ (na produkci na 18 z 24
 * stránek). Titulky bez značky naopak šablonu potřebují, proto se rozhoduje
 * podle obsahu, ne paušálně přes `absolute`.
 */
const hasBrand = (title: string): boolean =>
  title
    .toLowerCase()
    .replaceAll(/[^a-z]/g, '')
    .includes('barbitch')

export const cmsTitle = (title: string): string | { absolute: string } =>
  hasBrand(title) ? { absolute: title } : title

/**
 * Obrázek pro Open Graph s vyplněnými rozměry a popiskem.
 *
 * Bez nich Facebook/LinkedIn kartu nepředgenerují a musí obrázek nejdřív
 * stáhnout. Když stránka vlastní obrázek nemá, vrací se výchozí sociální
 * banner v korektních 1200×630 (dřív se dosazoval `bigBaner.jpg` bez rozměrů).
 */
export const ogImages = (url: string | undefined | null, alt: string) => {
  const absolute = absUrl(url)
  return absolute ? [{ url: absolute, alt }] : [{ ...DEFAULT_OG_IMAGE }]
}
