interface JobPostingProps {
  title: string
  // Kompletní popis pozice v HTML (požadováno Googlem).
  description: string
  datePosted: string
  validThrough?: string
  employmentType?: string
  salaryValue?: number
  salaryCurrency?: string
  salaryUnit?: string
}

export const JobPostingSchema = ({
  title,
  description,
  datePosted,
  validThrough,
  employmentType,
  salaryValue,
  salaryCurrency,
  salaryUnit,
}: JobPostingProps) => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title,
    description,
    datePosted,
    ...(validThrough ? { validThrough } : {}),
    ...(employmentType ? { employmentType } : {}),
    ...(salaryValue
      ? {
          baseSalary: {
            '@type': 'MonetaryAmount',
            currency: salaryCurrency || 'CZK',
            value: {
              '@type': 'QuantitativeValue',
              value: salaryValue,
              unitText: salaryUnit || 'HOUR',
            },
          },
        }
      : {}),
    directApply: true,
    hiringOrganization: {
      '@type': 'Organization',
      name: 'Bar.Bitch',
      sameAs: 'https://barbitch.cz',
      logo: 'https://barbitch.cz/favicon/apple-touch-icon.png',
    },
    jobLocation: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Křenová 294/16',
        addressLocality: 'Brno',
        addressRegion: 'Jihomoravský kraj',
        postalCode: '602 00',
        addressCountry: 'CZ',
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
