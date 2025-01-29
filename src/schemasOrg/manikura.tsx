import Head from 'next/head'
import Script from 'next/script'

const namePrice = 'Ceník manikúry'
const linkOffers = 'https://barbitch.cz/manikura'
const lowPrice = '400'
const highPrice = '2000'
const offerCount = '7'
const serviceType = 'Manikúra'
const name = 'Kompletní manikúra a nehtový design'
const description =
  'Profesionální manikúra v Brně – gelové, akrylové a francouzské nehty. Objednejte si termín online!'
const priceList = [
  {
    name: 'Hygienická manikúra',
    price: 400,
  },
  {
    name: 'Manikúra + gel lak',
    price: 700,
  },
  {
    name: 'Prodloužení nehtů',
    price: 900,
  },
  {
    name: 'Prodloužení nehtů MAXI',
    price: 1200,
  },
  {
    name: 'Design level 1',
    price: 1200,
  },
  {
    name: 'Design level 2',
    price: 1800,
  },
  {
    name: 'Design level 3',
    price: 2000,
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

export const SchemaJsonManikura = () => {
  return (
    <Head>
      <Script type={'application/ld+json'}>{`${schema}`}</Script>
    </Head>
  )
}
