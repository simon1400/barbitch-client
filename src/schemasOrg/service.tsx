interface ServiceSchemaProps {
  name: string
  url: string
  description?: string
}

export const ServiceSchema = ({ name, url, description }: ServiceSchemaProps) => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name,
    url,
    description: description || `${name} v Barbitch Beauty Studiu v Brně`,
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
      '@type': 'City',
      name: 'Brno',
    },
  }

  return (
    <script
      type={'application/ld+json'}
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
