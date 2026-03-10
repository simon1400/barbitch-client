interface ProductSchemaProps {
  name: string
  description: string
  url: string
  image?: string
  lowPrice: number
  highPrice: number
  offerCount: number
  priceCurrency?: string
  ratingValue?: number
  reviewCount?: number
  bestRating?: number
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
  ratingValue = 4.6,
  reviewCount = 113,
  bestRating = 5,
}: ProductSchemaProps) => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    description,
    url,
    image: image || 'https://barbitch.cz/assets/bigBaner.jpg',
    brand: {
      '@type': 'Brand',
      name: 'Barbitch',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue,
      reviewCount,
      bestRating,
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
        returnPolicyCategory: 'https://schema.org/MerchantReturnNotPermitted',
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
      seller: {
        '@type': 'BeautySalon',
        name: 'Barbitch',
        url: 'https://barbitch.cz',
      },
    },
  }

  return (
    <script
      type={'application/ld+json'}
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
