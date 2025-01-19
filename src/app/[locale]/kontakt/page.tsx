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
          images: [data.metaData.image.url],
        }
      : null,
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
