const namePrice = 'Ceník Řas'
const linkOffers = 'https://barbitch.cz/service/rasy'
const lowPrice = '1000'
const highPrice = '1300'
const offerCount = '3'
const serviceType = 'Řasy'
const name = 'Řasy Brno | Prodloužení a barvení řas – Barbitch Beauty Studio'
const description =
  'Užij si krásné řasy bez stresu! Nabízíme prodloužení řas Classic, 2D, 3D i barvení – vše v moderním beauty studiu v Brně. Objednej se ještě dnes.'
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
    name: 'Barbitch',
    url: 'https://barbitch.cz',
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
      id={'schema-org'}
      type={'application/ld+json'}
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
