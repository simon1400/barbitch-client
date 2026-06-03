import type { IPricelistGroup } from 'fetch/bookingPricelist'

import { SITE_URL } from 'lib/seo'

interface ServiceSeo {
  serviceType: string
  name: string
  description: string
  catalogName: string
  /** Shoda názvu Noona kategorie pro tuto službu (fuzzy, lowercase). */
  matchesGroup: (title: string) => boolean
}

/**
 * Kurátorovaný SEO copy zůstává statický (názvy/popisy ladí marketing),
 * ALE ceny a rozsah se počítají dynamicky z živého ceníku Noona — viz
 * ServicePriceSchema. Hardcode cen dřív zastarával (Noona je zdroj pravdy).
 */
const SERVICE_SEO: Record<string, ServiceSeo> = {
  manikura: {
    serviceType: 'Manikúra',
    name: 'Manikúra Brno | Gelové nehty & profesionální péče | Barbitch',
    description:
      'Hledáš kvalitní manikúru v Brně? Nabízíme gelové, francouzské a designové nehty v moderním beauty studiu. Objednej se online ještě dnes!',
    catalogName: 'Ceník manikúry',
    matchesGroup: (t) => t.includes('nehty') && !t.includes('junior'),
  },
  oboci: {
    serviceType: 'Obočí',
    name: 'Obočí Brno | Laminace, barvení a modelace – Barbitch Beauty Studio',
    description:
      'Upravené obočí bez starostí! Nabízíme laminaci, barvení i modelaci obočí v Brně. Svěř se profesionálkám z Barbitch studia a objednej se online.',
    catalogName: 'Ceník obočí',
    matchesGroup: (t) => t.includes('obočí'),
  },
  rasy: {
    serviceType: 'Řasy',
    name: 'Řasy Brno | Prodloužení a barvení řas – Barbitch Beauty Studio',
    description:
      'Užij si krásné řasy bez stresu! Nabízíme prodloužení řas Classic, 2D, 3D i barvení – vše v moderním beauty studiu v Brně. Objednej se ještě dnes.',
    catalogName: 'Ceník řas',
    matchesGroup: (t) => t.includes('řas'),
  },
}

export const PRICED_SERVICE_SLUGS = Object.keys(SERVICE_SEO)

export interface PricedService {
  title: string
  basePrice: number
}

/**
 * Sesbírá bookovatelné služby z živého ceníku pro daný slug
 * (kombinace jsou v getBookingPricelist už skryté → zůstávají jen základní služby).
 */
export const getServicesForSlug = (groups: IPricelistGroup[], slug: string): PricedService[] => {
  const seo = SERVICE_SEO[slug]
  if (!seo) return []
  const services: PricedService[] = []
  for (const group of groups) {
    if (!seo.matchesGroup(group.title.toLowerCase())) continue
    for (const s of group.services) {
      if (s.basePrice > 0) services.push({ title: s.title, basePrice: s.basePrice })
    }
  }
  return services
}

export const ServicePriceSchema = ({
  slug,
  services,
}: {
  slug: string
  services: PricedService[]
}) => {
  const seo = SERVICE_SEO[slug]
  if (!seo) return null

  const url = `${SITE_URL}/service/${slug}`
  const prices = services.map((s) => s.basePrice)
  const hasPrices = prices.length > 0

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: seo.serviceType,
    name: seo.name,
    provider: {
      '@type': 'BeautySalon',
      name: 'Barbitch',
      url: SITE_URL,
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Křenová 294/16',
        addressLocality: 'Brno',
        postalCode: '602 00',
        addressCountry: 'CZ',
      },
    },
    areaServed: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Brno',
        addressCountry: 'CZ',
      },
    },
    description: seo.description,
    // Ceny vkládáme jen když je živý ceník dostupný — nikdy 0 / zastaralý hardcode.
    ...(hasPrices && {
      offers: {
        '@type': 'AggregateOffer',
        priceCurrency: 'CZK',
        lowPrice: Math.min(...prices),
        highPrice: Math.max(...prices),
        offerCount: prices.length,
        url,
        availability: 'https://schema.org/InStock',
      },
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: seo.catalogName,
        itemListElement: services.map((item) => ({
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: item.title,
          },
          price: item.basePrice,
          priceCurrency: 'CZK',
        })),
      },
    }),
  }

  return (
    <script
      id={'schema-org'}
      type={'application/ld+json'}
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
