import { BRAND, SITE_URL } from 'lib/seo'

/**
 * Jedna identita salonu a webu ve strukturovaných datech (s305).
 *
 * Celý záznam `BeautySalon` (adresa, otevírací doba, telefon) je jen na
 * hlavní stránce a /kontakt (`LocalBusinessSchema`). Ostatní schémata — služby,
 * voucher, články, ceník — na něj odkazují stejným `@id`, místo aby kopírovala
 * adresu: dřív to pro Google byly samostatné podniky bez vazby (audit s301).
 */
export const LOCAL_BUSINESS_ID = `${SITE_URL}/#localbusiness`
export const WEBSITE_ID = `${SITE_URL}/#website`

export const LOGO = {
  '@type': 'ImageObject',
  url: `${SITE_URL}/logo.jpg`,
  width: 600,
  height: 600,
} as const

/** Odkaz na salon (provider, seller, publisher, worksFor). */
export const salonRef = {
  '@type': 'BeautySalon',
  '@id': LOCAL_BUSINESS_ID,
  name: BRAND,
  url: `${SITE_URL}/`,
} as const

/** Odkaz na salon jako vydavatele článků — Google u publishera chce logo. */
export const publisherRef = { ...salonRef, logo: LOGO } as const

/** Uzel `WebSite` — deklaruje se na hlavní stránce a /kontakt, jinde jen `{ '@id': WEBSITE_ID }`. */
export const websiteNode = {
  '@type': 'WebSite',
  '@id': WEBSITE_ID,
  url: `${SITE_URL}/`,
  name: BRAND,
  alternateName: ['Barbitch', 'Bar Bitch'],
  inLanguage: 'cs-CZ',
  publisher: { '@id': LOCAL_BUSINESS_ID },
} as const
