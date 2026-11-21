import { jsonLd } from 'lib/jsonLd'
import { absUrl } from 'lib/seo'

import { salonRef, WEBSITE_ID } from './salon'

/**
 * Statické stránky z kolekce `article` (/o-nas, /bitchcard, obchodní podmínky,
 * cookies, reklamační řád, doprava a platba…) — nejsou to články, proto
 * `WebPage` / `AboutPage` místo `Article` s datem „vydání“ (audit s301, s305).
 */
const ABOUT_SLUGS = new Set(['o-nas'])

export const WebPageSchema = ({
  slug,
  url,
  name,
  description,
  image,
  dateModified,
}: {
  slug: string
  url: string
  name: string
  description: string
  image?: string
  dateModified?: string
}) => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': ABOUT_SLUGS.has(slug) ? 'AboutPage' : 'WebPage',
    '@id': `${url}#webpage`,
    url,
    name,
    ...(description && description !== name ? { description } : {}),
    ...(absUrl(image) ? { primaryImageOfPage: absUrl(image) } : {}),
    ...(dateModified ? { dateModified } : {}),
    inLanguage: 'cs-CZ',
    isPartOf: { '@id': WEBSITE_ID },
    about: salonRef,
    publisher: salonRef,
  }

  return (
    <script type={'application/ld+json'} dangerouslySetInnerHTML={{ __html: jsonLd(schema) }} />
  )
}
