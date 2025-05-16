import type { Metadata } from 'next'

import Button from 'components/Button'
import { Container } from 'components/Container'
import { MasonryGalery } from 'components/MansoryGalery'
import { PriceTable } from 'components/PriceTable'
import { getLinkToReserve } from 'fetch/contact'
import { getFullServiceMeta } from 'fetch/getMeta'
import { getCurrentPriceList } from 'fetch/pricelist'
import { getFullService } from 'fetch/service'
import parse from 'html-react-parser'
import { SchemaJsonManikura } from 'schemasOrg/manikura'
import { SchemaJsonOboci } from 'schemasOrg/oboci'
import { SchemaJsonRasy } from 'schemasOrg/rasy'
import { Top } from 'sections/Top/Top'

export async function generateMetadata({ params }: any): Promise<Metadata> {
  const { slug } = await params
  const meta = await getFullServiceMeta(slug)

  return {
    title: meta.metaData.title || meta.title,
    description: meta.metaData.description || '',
    openGraph: {
      title: meta.metaData.title || meta.title,
      description: meta.metaData.description || '',
      siteName: 'Barbitch',
      images: [
        meta.metaData.image ? meta.metaData.image.url : 'https://barbitch.cz/assets/bigBaner.jpg',
      ],
      url: `https://barbitch.cz/service/${slug}`,
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: meta.metaData.title || meta.title,
      description: meta.metaData.description || '',
      images: [
        meta.metaData.image ? meta.metaData.image.url : 'https://barbitch.cz/assets/bigBaner.jpg',
      ],
    },
    keywords: [
      'barbitch',
      'bar.bitch',
      'bar bitch',
      'Brno',
      'Manikúra',
      'Prodlužování řas',
      'Úprava obočí',
    ],
    alternates: {
      canonical: `https://barbitch.cz/service/${slug}`,
    },
  }
}

const Section = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <section className={`pb-16 ${className || ''}`}>
    <Container size={'lg'}>{children}</Container>
  </section>
)

const Service = async ({ params }: any) => {
  const { slug } = await params

  const [data, dataLink] = await Promise.all([getFullService(slug), getLinkToReserve()])

  const priceList = await getCurrentPriceList(data.title === 'Manikúra' ? 'Nehty' : data.title)

  return (
    <main>
      {slug === 'oboci' && <SchemaJsonOboci />}
      {slug === 'rasy' && <SchemaJsonRasy />}
      {slug === 'manikura' && <SchemaJsonManikura />}
      <Top title={data.title} small linkToReserve={dataLink.linkToReserve} />
      <Section>
        <div className={'text-xs1 lg:text-base content'}>
          {parse(data.description || '', { trim: true })}
        </div>
      </Section>
      {data.galery?.length > 0 && <MasonryGalery images={data.galery} />}
      <section>
        <PriceTable data={priceList} />
      </section>
      <Section>
        <div className={'text-xs1 lg:text-base content'}>
          {parse(data.additionalDescription || '', { trim: true })}
        </div>
        <Button
          className={'mt-5'}
          id={'book-button'}
          text={'Rezervovat termín'}
          href={dataLink.linkToReserve}
        />
      </Section>
    </main>
  )
}

export default Service
