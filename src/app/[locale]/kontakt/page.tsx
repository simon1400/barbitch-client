import type { Metadata } from 'next'

import { getContactMeta } from 'fetch/getMeta'
import { Top } from 'sections/Top'

export async function generateMetadata(): Promise<Metadata> {
  const data = await getContactMeta()

  return {
    title: data.metaData.title,
    description: data.metaData.description,
    openGraph: data.metaData.image
      ? {
          title: data.metaData.title || 'Kontakt',
          description: data.metaData.description || '',
          siteName: 'Bar.bitch – Luxusní manikúra, obočí a řasy',
          images: [data.metaData.image.url],
          url: `https://barbitch.cz/kontakt`,
          type: 'article',
        }
      : null,
    twitter: {
      card: 'summary_large_image',
      title: data.metaData.title || 'Kontakt',
      description: data.metaData.description || '',
      images: data.metaData.image ? [data.metaData.image.url] : undefined,
    },
  }
}

const Contact = async () => {
  return (
    <main>
      <Top title={'Kontakt'} small />
    </main>
  )
}

export default Contact
