import { jsonLd } from 'lib/jsonLd'
import { BRAND } from 'lib/seo'

import { salonRef, WEBSITE_ID } from './salon'

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
    description: description || `${name} v salonu ${BRAND} v Brně`,
    '@id': `${url}#service`,
    provider: salonRef,
    isPartOf: { '@id': WEBSITE_ID },
    areaServed: {
      '@type': 'City',
      name: 'Brno',
    },
  }

  return (
    <script type={'application/ld+json'} dangerouslySetInnerHTML={{ __html: jsonLd(schema) }} />
  )
}
