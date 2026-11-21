import { jsonLd } from 'lib/jsonLd'
import { absUrl, clampHeadline, latestDate } from 'lib/seo'

import { publisherRef, salonRef, WEBSITE_ID } from './salon'

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
          worksFor: salonRef,
        }
      : // Bez autora píše salon (dřív „Barbitch Team“ bez vazby na podnik).
        salonRef,
    publisher: publisherRef,
    inLanguage: 'cs-CZ',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
      isPartOf: { '@id': WEBSITE_ID },
    },
  }

  return (
    <script type={'application/ld+json'} dangerouslySetInnerHTML={{ __html: jsonLd(schema) }} />
  )
}
