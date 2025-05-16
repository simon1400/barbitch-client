import type { Metadata } from 'next'

import { Container } from 'components/Container'
import { PriceTable } from 'components/PriceTable'
import { getLinkToReserve } from 'fetch/contact'
import { getPricelistMeta } from 'fetch/getMeta'
import { getPriceList, getPricelistPage } from 'fetch/pricelist'
import parse from 'html-react-parser'
import { Top } from 'sections/Top/Top'

export async function generateMetadata(): Promise<Metadata> {
  const { metaData } = await getPricelistMeta()

  return {
    title: metaData.title,
    description: metaData.description,
    openGraph: {
      title: metaData.title || 'Ceník',
      description: metaData.description || '',
      siteName: 'Barbitch',
      images: [metaData.image ? metaData.image.url : 'https://barbitch.cz/assets/bigBaner.jpg'],
      url: `https://barbitch.cz/cenik`,
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: metaData.title || 'Ceník',
      description: metaData.description || '',
      images: [metaData.image ? metaData.image.url : 'https://barbitch.cz/assets/bigBaner.jpg'],
    },
    keywords: [
      'barbitch',
      'bar.bitch',
      'Cenik',
      'Brno',
      'Manikúra',
      'Nehty',
      'Prodlužování řas',
      'Úprava obočí',
    ],
    alternates: {
      canonical: `https://barbitch.cz/cenik`,
    },
  }
}

const PriceList = async () => {
  const [data, dataPage, dataLink] = await Promise.all([
    getPriceList(),
    getPricelistPage(),
    getLinkToReserve(),
  ])

  return (
    <main>
      <Top title={dataPage.title} small linkToReserve={dataLink.linkToReserve} />
      <section className={'pb-16'}>
        <Container size={'lg'}>
          {dataPage.contentText && (
            <div className={'w-full mb-20 text-xs1 lg:text-base'}>
              {parse(dataPage.contentText, { trim: true })}
            </div>
          )}
        </Container>
        <PriceTable data={data} showTitle />
      </section>
    </main>
  )
}

export default PriceList
