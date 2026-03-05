import type { Metadata } from 'next'

import { CenikTable } from 'components/CenikTable'
import { Container } from 'components/Container'
import { DynamicContent } from 'components/DynamicContent'
import { getBookingPricelist } from 'fetch/bookingPricelist'
import { getLinkToReserve } from 'fetch/contact'
import { getPricelistMeta } from 'fetch/getMeta'
import { getPricelistPage } from 'fetch/pricelist'
import { getStrapiImageUrl } from 'lib/image-utils'
import { parseHtml } from 'lib/parseHtml'
import { BreadcrumbSchema } from 'schemasOrg/breadcrumb'
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
    keywords: [
      'barbitch',
      'ceník',
      'ceny',
      'manikúra cena',
      'řasy cena',
      'obočí cena',
      'Brno',
      'beauty studio',
    ],
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
      <BreadcrumbSchema
        items={[
          { name: 'Hlavní strana', url: 'https://barbitch.cz' },
          { name: 'Ceník', url: 'https://barbitch.cz/cenik' },
        ]}
      />
      <Top title={dataPage.title} small linkToReserve={dataLink.linkToReserve} />
      <Container size={'lg'}>
        {dataPage.contentText && (
          <div className={'w-full mb-10 text-xs1 lg:text-base content'}>
            {parseHtml(dataPage.contentText)}
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
