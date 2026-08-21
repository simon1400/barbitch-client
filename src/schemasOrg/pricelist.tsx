import type { IPricelistGroup } from 'fetch/bookingPricelist'

import { jsonLd } from 'lib/jsonLd'
import { SITE_URL } from 'lib/seo'

import { LOCAL_BUSINESS_ID } from './localBusiness'

/**
 * Ceník jako `OfferCatalog` se živými cenami z enginu.
 *
 * Stránka `/cenik` dosud neměla žádnou nabídkovou strukturu — ceny byly jen
 * v textu. Když katalog není dostupný, schéma se nevykreslí vůbec: lepší nic
 * než nula nebo zastaralá čísla.
 */
export const PricelistSchema = ({ groups }: { groups: IPricelistGroup[] }) => {
  const catalogs = groups
    .map((group) => ({
      '@type': 'OfferCatalog',
      name: group.title,
      itemListElement: group.services
        .filter((service) => service.basePrice > 0)
        .map((service) => ({
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: service.title,
          },
          price: service.basePrice,
          priceCurrency: 'CZK',
          availability: 'https://schema.org/InStock',
        })),
    }))
    .filter((catalog) => catalog.itemListElement.length > 0)

  if (catalogs.length === 0) return null

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'OfferCatalog',
    '@id': `${SITE_URL}/cenik#catalog`,
    name: 'Ceník služeb Barbitch Brno',
    url: `${SITE_URL}/cenik`,
    provider: { '@id': LOCAL_BUSINESS_ID },
    itemListElement: catalogs,
  }

  return (
    <script
      id={'schema-org-pricelist'}
      type={'application/ld+json'}
      dangerouslySetInnerHTML={{ __html: jsonLd(schema) }}
    />
  )
}
