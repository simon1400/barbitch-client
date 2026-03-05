interface ProductSchemaProps {
  name: string
  description: string
  url: string
  image?: string
}

export const ProductSchema = ({ name, description, url, image }: ProductSchemaProps) => {
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
    offers: {
      '@type': 'Offer',
      priceCurrency: 'CZK',
      availability: 'https://schema.org/InStock',
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
