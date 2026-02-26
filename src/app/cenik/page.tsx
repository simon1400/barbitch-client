import type { Metadata } from 'next'

import { CenikTable } from 'components/CenikTable'
import { Container } from 'components/Container'
import { DynamicContent } from 'components/DynamicContent'
import { getBookingPricelist } from 'fetch/bookingPricelist'
import { getLinkToReserve } from 'fetch/contact'
import { getPricelistMeta } from 'fetch/getMeta'
import { getPricelistPage } from 'fetch/pricelist'
import parse from 'html-react-parser'
import { getStrapiImageUrl } from 'lib/image-utils'
import Reviews from 'sections/Reviews'
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
      images: [getStrapiImageUrl(metaData.image?.url)],
      url: `https://barbitch.cz/cenik`,
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: metaData.title || 'Ceník',
      description: metaData.description || '',
      images: [getStrapiImageUrl(metaData.image?.url)],
    },
    alternates: {
      canonical: `https://barbitch.cz/cenik`,
    },
  }
}

const PriceList = async () => {
  const [groups, dataPage, dataLink] = await Promise.all([
    getBookingPricelist(),
    getPricelistPage(),
    getLinkToReserve(),
  ])

  return (
    <main>
      <Top title={dataPage.title} small linkToReserve={dataLink.linkToReserve} />
      <Container size={'lg'}>
        {dataPage.contentText && (
          <div className={'w-full mb-10 text-xs1 lg:text-base content'}>
            {parse(dataPage.contentText, { trim: true })}
          </div>
        )}
      </Container>
      <CenikTable groups={groups} />
      <DynamicContent data={dataPage.dynamicContent} />
      <Reviews />
    </main>
  )
}

export default PriceList
