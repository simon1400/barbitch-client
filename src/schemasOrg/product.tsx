import { jsonLd } from 'lib/jsonLd'
import { absUrl, BRAND, SITE_URL } from 'lib/seo'

import { salonRef } from './salon'

interface ProductSchemaProps {
  name: string
  description: string
  url: string
  image?: string
  lowPrice: number
  highPrice: number
  offerCount: number
  priceCurrency?: string
}

export const ProductSchema = ({
  name,
  description,
  url,
  image,
  lowPrice,
  highPrice,
  offerCount,
  priceCurrency = 'CZK',
}: ProductSchemaProps) => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': `${url}#product`,
    name,
    description,
    url,
    image: absUrl(image) || `${SITE_URL}/assets/bigBaner.jpg`,
    brand: {
      '@type': 'Brand',
      name: BRAND,
    },
    offers: {
      '@type': 'AggregateOffer',
      lowPrice,
      highPrice,
      offerCount,
      priceCurrency,
      priceValidUntil: `${new Date().getFullYear() + 1}-12-31`,
      availability: 'https://schema.org/InStock',
      url,
      hasMerchantReturnPolicy: {
        '@type': 'MerchantReturnPolicy',
        applicableCountry: 'CZ',
        // Jako v obchodních podmínkách §9.6 a na stránce: nevyužitý voucher lze
        // do 14 dnů vrátit, peníze zpět na kartu, zdarma. Dřív „NotPermitted“ —
        // rozpor s viditelným textem (audit s301, oprava s303).
        returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
        merchantReturnDays: 14,
        returnMethod: 'https://schema.org/ReturnByMail',
        returnFees: 'https://schema.org/FreeReturn',
        refundType: 'https://schema.org/FullRefund',
        merchantReturnLink: `${SITE_URL}/obchodni-podminky`,
      },
      shippingDetails: {
        '@type': 'OfferShippingDetails',
        shippingDestination: {
          '@type': 'DefinedRegion',
          addressCountry: 'CZ',
        },
        shippingRate: {
          '@type': 'MonetaryAmount',
          value: 0,
          currency: 'CZK',
        },
        deliveryTime: {
          '@type': 'ShippingDeliveryTime',
          handlingTime: {
            '@type': 'QuantitativeValue',
            minValue: 0,
            maxValue: 0,
            unitCode: 'DAY',
          },
          transitTime: {
            '@type': 'QuantitativeValue',
            minValue: 0,
            maxValue: 0,
            unitCode: 'DAY',
          },
        },
      },
      seller: salonRef,
    },
  }

  return (
    <script type={'application/ld+json'} dangerouslySetInnerHTML={{ __html: jsonLd(schema) }} />
  )
}
