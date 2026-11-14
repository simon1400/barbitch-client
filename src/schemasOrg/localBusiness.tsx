import { getContact } from 'fetch/contact'
import { getCatalogPrices, priceRangeOf } from 'fetch/home'
import { jsonLd } from 'lib/jsonLd'
import { SITE_URL } from 'lib/seo'

/**
 * Jediná identita salonu ve strukturovaných datech.
 *
 * Dřív existovaly dvě různé entity `BeautySalon` (homepage s `@id: barbitch.cz`,
 * `/kontakt` bez `@id` a s méně poli) — pro Google to byly dva různé podniky.
 * Teď obě stránky renderují totéž pod stabilním `@id`.
 *
 * Telefon a e-mail se berou z CMS (`contact`), aby NAP na webu, v JSON-LD
 * a v Google Business profilu nemohly rozejít. Adresa, souřadnice a otevírací
 * doba zůstávají konstantami — v CMS jsou uložené jako HTML pro lidi
 * (`<p>Křenová 294/16,<br>Brno 602 00</p>`), ne jako strukturovaná pole.
 */
export const LOCAL_BUSINESS_ID = `${SITE_URL}/#localbusiness`

const FALLBACK_PHONE = '+420 776 527 194'
const FALLBACK_EMAIL = 'info@barbitch.cz'

// Záloha rozpětí cen, když katalog enginu neodpoví (ceník 11/2026: 300–2090 Kč).
const FALLBACK_PRICE_RANGE = '300 CZK - 2090 CZK'

const buildSchema = (telephone: string, email: string, priceRange: string) => ({
  '@context': 'https://schema.org',
  '@type': 'BeautySalon',
  '@id': LOCAL_BUSINESS_ID,
  name: 'Barbitch',
  image: `${SITE_URL}/logo.jpg`,
  url: SITE_URL,
  telephone,
  email,
  // Skutečné rozpětí z katalogu (dřív napevno 200–2000, audit 09.11).
  priceRange,
  paymentAccepted: 'Cash, Card',
  currenciesAccepted: 'CZK',
  hasMap: 'https://maps.google.com/?q=Křenová+294/16,+Brno',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Křenová 294/16',
    addressLocality: 'Brno',
    postalCode: '602 00',
    addressCountry: 'CZ',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: '49.1928',
    longitude: '16.6163',
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      opens: '10:00',
      closes: '19:00',
    },
  ],
  sameAs: ['https://www.instagram.com/barbitch.cz', 'https://www.facebook.com/barbtchcz'],
  contactPoint: {
    '@type': 'ContactPoint',
    telephone,
    email,
    contactType: 'customer service',
    availableLanguage: ['Czech'],
  },
})

export const LocalBusinessSchema = async () => {
  const [contact, catalog] = await Promise.all([getContact(), getCatalogPrices()])
  const schema = buildSchema(
    contact.phone || FALLBACK_PHONE,
    contact.email || FALLBACK_EMAIL,
    priceRangeOf(catalog) || FALLBACK_PRICE_RANGE,
  )

  return (
    <script
      id={'schema-org-localbusiness'}
      type={'application/ld+json'}
      dangerouslySetInnerHTML={{ __html: jsonLd(schema) }}
    />
  )
}
