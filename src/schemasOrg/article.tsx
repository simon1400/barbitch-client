import { jsonLd } from 'lib/jsonLd'
import { absUrl, clampHeadline, latestDate, SITE_URL } from 'lib/seo'

interface ArticleSchemaProps {
  title: string
  description: string
  image?: string
  datePublished?: string
  dateModified?: string
  /** Autor článku (s291) → `Person`; bez něj autorem je salon (`Organization`). */
  author?: { name: string; role?: string | null; image?: string }
  url: string
}

export const ArticleSchema = ({
  title,
  description,
  image,
  datePublished,
  dateModified,
  author,
  url,
}: ArticleSchemaProps) => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: clampHeadline(title),
    description,
    image: absUrl(image),
    datePublished,
    // Strapi ukládá `updatedAt` o zlomek sekundy dřív než `publishedAt` —
    // bez tohoto by každý článek tvrdil, že byl upraven před vydáním.
    dateModified: latestDate(datePublished, dateModified),
    author: author
      ? {
          '@type': 'Person',
          name: author.name,
          ...(author.role ? { jobTitle: author.role } : {}),
          ...(author.image ? { image: absUrl(author.image) } : {}),
          worksFor: { '@type': 'Organization', name: 'Barbitch', url: SITE_URL },
        }
      : {
          '@type': 'Organization',
          name: 'Barbitch Team',
          url: SITE_URL,
        },
    publisher: {
      '@type': 'Organization',
      name: 'Barbitch',
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/logo.jpg`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
  }

  return (
    <script type={'application/ld+json'} dangerouslySetInnerHTML={{ __html: jsonLd(schema) }} />
  )
}
