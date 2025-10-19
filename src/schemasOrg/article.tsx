interface ArticleSchemaProps {
  title: string
  description: string
  image: string
  datePublished: string
  dateModified: string
  author?: string
  url: string
}

export const ArticleSchema = ({
  title,
  description,
  image,
  datePublished,
  dateModified,
  author = 'Barbitch Team',
  url,
}: ArticleSchemaProps) => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description: description,
    image: image,
    datePublished: datePublished,
    dateModified: dateModified,
    author: {
      '@type': 'Organization',
      name: author,
      url: 'https://barbitch.cz',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Barbitch',
      logo: {
        '@type': 'ImageObject',
        url: 'https://barbitch.cz/logo.jpg',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
  }

  return (
    <script
      type={'application/ld+json'}
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
