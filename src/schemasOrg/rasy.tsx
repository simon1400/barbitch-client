const namePrice = 'Ceník Řas'
const linkOffers = 'https://barbitch.cz/rasy'
const lowPrice = '1000'
const highPrice = '1300'
const offerCount = '3'
const serviceType = 'Řasy'
const name = 'Prodlužování řas a lash lifting'
const description =
  'Profesionální prodlužování řas v Brně – klasické, objemové a hybridní metody. Přirozený vzhled a dlouhá výdrž. Objednejte se nyní!'
const priceList = [
  {
    name: 'Prodloužení řas Classic',
    price: 1000,
  },
  {
    name: 'Prodloužení řas Classic 2D',
    price: 1100,
  },
  {
    name: 'Prodloužení řas Classic 3D',
    price: 1300,
  },
]

const schema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  serviceType,
  name,
  provider: {
    '@type': 'BeautySalon',
    name: 'Barbitch Beauty Studio',
    url: 'https://barbitch.cz',
  },
  areaServed: {
    '@type': 'Place',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Křenová 294/16',
      addressLocality: 'Brno',
      postalCode: '602 00',
      addressCountry: 'CZ',
    },
  },
  description,
  offers: {
    '@type': 'AggregateOffer',
    priceCurrency: 'CZK',
    lowPrice,
    highPrice,
    offerCount,
    url: linkOffers,
    availability: 'https://schema.org/InStock',
    validFrom: '2024-02-01',
  },
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: namePrice,
    itemListElement: priceList.map((item) => ({
      '@type': 'Offer',
      itemOffered: {
        '@type': 'Service',
        name: item.name,
      },
      price: item.price,
      priceCurrency: 'CZK',
    })),
  },
}

export const SchemaJsonRasy = () => {
  return (
    <script
      id={'Schema org'}
      type={'application/ld+json'}
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
