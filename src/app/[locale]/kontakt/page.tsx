import type { Metadata } from 'next'

import { Container } from 'components/Container'
import { getContactContent, getLinkToReserve } from 'fetch/contact'
import { getContactMeta } from 'fetch/getMeta'
import parse from 'html-react-parser'
import { Top } from 'sections/Top/Top'

export async function generateMetadata(): Promise<Metadata> {
  const data = await getContactMeta()

  return {
    title: data.metaData.title,
    description: data.metaData.description,
    openGraph: data.metaData.image
      ? {
          title: data.metaData.title || 'Kontakt',
          description: data.metaData.description || '',
          siteName: 'Barbitch',
          images: [
            data.metaData.image
              ? data.metaData.image.url
              : 'https://barbitch.cz/assets/bigBaner.jpg',
          ],
          url: `https://barbitch.cz/kontakt`,
          type: 'article',
        }
      : null,
    twitter: {
      card: 'summary_large_image',
      title: data.metaData.title || 'Kontakt',
      description: data.metaData.description || '',
      images: [
        data.metaData.image ? data.metaData.image.url : 'https://barbitch.cz/assets/bigBaner.jpg',
      ],
    },
    keywords: [
      'barbitch',
      'bar.bitch',
      'Kontakt',
      'Brno',
      'Manikúra',
      'Prodlužování řas',
      'Úprava obočí',
    ],
    alternates: {
      canonical: `https://barbitch.cz/kontakt`,
    },
  }
}

const Contact = async () => {
  const dataLink = await getLinkToReserve()
  const dataContent = await getContactContent()
  return (
    <main>
      <Top title={'Kontakt'} small linkToReserve={dataLink.linkToReserve} />
      <section>
        <Container size={'md'}>
          <div className={'content'}>{parse(dataContent.content, { trim: true })}</div>
        </Container>
      </section>
    </main>
  )
}

export default Contact
