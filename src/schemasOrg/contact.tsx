const schema = {
  '@context': 'https://schema.org',
  '@type': 'BeautySalon',
  name: 'Barbitch',
  url: 'https://barbitch.cz',
  telephone: '+420 776 315 366',
  email: 'info@barbitch.cz',
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
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+420 776 315 366',
    email: 'info@barbitch.cz',
    contactType: 'customer service',
    availableLanguage: ['Czech'],
  },
}

export const ContactSchema = () => {
  return (
    <script
      type={'application/ld+json'}
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
