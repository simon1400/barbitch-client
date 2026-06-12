import { jsonLd } from 'lib/jsonLd'
import { GOOGLE_RATING } from 'lib/seo'

const schema = {
  '@context': 'https://schema.org',
  '@type': 'BeautySalon',
  name: 'Barbitch',
  image: 'https://barbitch.cz/logo.jpg',
  '@id': 'https://barbitch.cz',
  url: 'https://barbitch.cz',
  telephone: '+420 776 315 366',
  email: 'info@barbitch.cz',
  priceRange: '200 CZK - 2000 CZK',
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
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: GOOGLE_RATING.ratingValue,
    reviewCount: GOOGLE_RATING.reviewCount,
    bestRating: GOOGLE_RATING.bestRating,
  },
}

export const SchemaJsonHomepage = () => {
  return (
    <script
      id={'schema-org'}
      type={'application/ld+json'}
      dangerouslySetInnerHTML={{
        __html: jsonLd(schema),
      }}
    />
  )
}
