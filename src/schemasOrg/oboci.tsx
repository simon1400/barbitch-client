const namePrice = 'Ceník Obočí'
const linkOffers = 'https://barbitch.cz/service/oboci'
const lowPrice = '200'
const highPrice = '1000'
const offerCount = '5'
const serviceType = 'Obočí'
const name = 'Obočí Brno | Laminace, barvení a modelace – Barbitch Beauty Studio'
const description =
  'Upravené obočí bez starostí! Nabízíme laminaci, barvení i modelaci obočí v Brně. Svěř se profesionálkám z Barbitch studia a objednej se online.'
const priceList = [
  {
    name: 'Odstranění chloupků nad pusou',
    price: 200,
  },
  {
    name: 'Modelování obočí',
    price: 300,
  },
  {
    name: 'Barvení + modelování obočí (henna/barva)',
    price: 600,
  },
  {
    name: 'Laminace / dlouhodobý styling obočí (+modelování)',
    price: 800,
  },
  {
    name: 'Laminace + barvení + modelování obočí',
    price: 1000,
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

export const SchemaJsonOboci = () => {
  return (
    <script
      id={'schema-org'}
      type={'application/ld+json'}
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
