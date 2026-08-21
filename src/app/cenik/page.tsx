import type { Metadata } from 'next'

import { Breadcrumbs } from 'components/Breadcrumbs'
import { CenikTable } from 'components/CenikTable'
import { Container } from 'components/Container'
import { DynamicContent } from 'components/DynamicContent'
import { getBookingPricelist } from 'fetch/bookingPricelist'
import { getLinkToReserve } from 'fetch/contact'
import { getPricelistMeta } from 'fetch/getMeta'
import { getPricelistPage } from 'fetch/pricelist'
import { getReviews } from 'fetch/reviews'
import { parseHtml } from 'lib/parseHtml'
import { cmsTitle, ogImages } from 'lib/seo'
import { PricelistSchema } from 'schemasOrg/pricelist'
import Reviews from 'sections/Reviews'
import { Top } from 'sections/Top/Top'

export const revalidate = 3600

export async function generateMetadata(): Promise<Metadata> {
  const { metaData } = await getPricelistMeta()

  return {
    // Bez fallbacku by výpadek CMS znamenal prázdný <title>.
    title: cmsTitle(metaData.title || 'Ceník služeb – manikúra, řasy a obočí Brno'),
    description:
      metaData.description ||
      'Aktuální ceník salonu Barbitch v Brně: manikúra, gel lak, prodlužování řas a úprava obočí. Rezervujte si termín online.',
    openGraph: {
      title: metaData.title || 'Ceník služeb – manikúra, řasy a obočí Brno',
      description: metaData.description || '',
      siteName: 'Barbitch',
      locale: 'cs_CZ',
      images: ogImages(metaData.image?.url, 'Ceník služeb Barbitch Brno'),
      url: `https://barbitch.cz/cenik`,
      // Ceník není článek.
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: metaData.title || 'Ceník',
      description: metaData.description || '',
      images: ogImages(metaData.image?.url, 'Ceník služeb Barbitch Brno'),
    },
    alternates: {
      canonical: `https://barbitch.cz/cenik`,
    },
  }
}

const PriceList = async () => {
  const [groups, dataPage, dataLink, reviews] = await Promise.all([
    getBookingPricelist(),
    getPricelistPage(),
    getLinkToReserve(),
    getReviews(),
  ])

  return (
    <main>
      <PricelistSchema groups={groups} />
      <Top title={dataPage.title} small linkToReserve={dataLink.linkToReserve} />
      <Breadcrumbs
        items={[
          { name: 'Hlavní strana', url: 'https://barbitch.cz' },
          { name: 'Ceník', url: 'https://barbitch.cz/cenik' },
        ]}
      />
      <Container size={'lg'}>
        {dataPage.contentText && (
          <div className={'w-full mb-10 text-xs1 lg:text-base content'}>
            {parseHtml(dataPage.contentText)}
          </div>
        )}
      </Container>
      <CenikTable groups={groups} />
      <DynamicContent data={dataPage.dynamicContent} />
      <Reviews reviews={reviews} />
    </main>
  )
}

export default PriceList
