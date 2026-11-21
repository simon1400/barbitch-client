export const SITE_URL = 'https://barbitch.cz'

/**
 * Výchozí Open Graph / Twitter obrázek pro stránky, které nemají vlastní.
 * Stejný sociální banner, který se používá v rezervaci a voucheru.
 */
export const DEFAULT_OG_IMAGE = {
  url: '/assets/bigBaner.jpg',
  width: 1200,
  height: 630,
  alt: 'Bar.Bitch Brno – manikúra, řasy a obočí',
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
 * Jediné psaní značky ve titulcích, og:title, siteName a JSON-LD (s305).
 * Dřív bylo v <title> pět variant (Barbitch, Bar.bitch, BarBitch, „Barbitch Brno“,
 * „Barbitch Beauty Studio“) — z kódu i z titulků v Strapi.
 */
export const BRAND = 'Bar.Bitch'

const VARIANT = String.raw`bar\.?\s?bitch(?:\s+beauty\s+stud(?:io|ia|iu))?`
/** Značka na konci titulku: „… | Barbitch“, „… – Barbitch Beauty Studio“, „… – Bar.bitch, Brno“, „… | Salon krásy Brno Bar.bitch“. */
const TRAILING_BRAND = new RegExp(
  String.raw`\s*[|–—-]\s*(?:(?:salon krásy|kosmetický salon)\s+brno\s+)?${VARIANT}(?:,?\s+brno)?\s*$`,
  'i',
)
const ANY_BRAND = new RegExp(String.raw`\b${VARIANT}\b`, 'gi')

/**
 * Celý titulek se značkou na konci: „<titulek> | Bar.Bitch“. Koncovou značku
 * z CMS v jakékoli podobě nahradí jednotnou; značku uprostřed („B.B.Blog Barbitch | …“)
 * jen přepíše na `BRAND`. Používá se pro <title> i og:title / twitter:title.
 */
export const brandTitle = (title: string): string => {
  const trimmed = title.trim()
  const base = trimmed.replace(TRAILING_BRAND, '').trim()
  if (base !== trimmed || !ANY_BRAND.test(base)) {
    ANY_BRAND.lastIndex = 0
    return `${base.replace(ANY_BRAND, BRAND)} | ${BRAND}`
  }
  ANY_BRAND.lastIndex = 0
  return base.replace(ANY_BRAND, BRAND)
}

/**
 * Titulek z CMS pro `metadata.title`. Vždy `absolute` — značku doplní/sjednotí
 * `brandTitle`, šablona layoutu by ji jinak přidala podruhé
 * („Manikúra Brno … | Barbitch | Barbitch“, dřív na 18 z 24 stránek).
 */
export const cmsTitle = (title: string): { absolute: string } => ({ absolute: brandTitle(title) })

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
