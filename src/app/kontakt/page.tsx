import type { Metadata } from 'next'

import { Container } from 'components/Container'
import { getContactContent, getLinkToReserve } from 'fetch/contact'
import { getContactMeta } from 'fetch/getMeta'
import parse from 'html-react-parser'
import { Top } from 'sections/Top/Top'

export const dynamic = 'force-static'

export async function generateMetadata(): Promise<Metadata> {
  const data = await getContactMeta()

  return {
    title: data.metaData.title,
    description: data.metaData.description,
    openGraph: {
      title: data.metaData.title || 'Kontakt',
      description: data.metaData.description || '',
      siteName: 'Barbitch',
      images: [
        data.metaData.image ? data.metaData.image.url : 'https://barbitch.cz/assets/bigBaner.jpg',
      ],
      url: `https://barbitch.cz/kontakt`,
      type: 'article',
    },
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
      'Nehty',
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
      <Container size={'md'}>
        <div className={'content'}>{parse(dataContent.content, { trim: true })}</div>
      </Container>
    </main>
  )
}

export default Contact
