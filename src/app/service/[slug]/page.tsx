import type { Metadata } from 'next'

import { DynamicContent } from 'components/DynamicContent'
import { getLinkToReserve } from 'fetch/contact'
import { getFullServiceMeta } from 'fetch/getMeta'
import { getFullService } from 'fetch/service'
import { SchemaJsonManikura } from 'schemasOrg/manikura'
import { SchemaJsonOboci } from 'schemasOrg/oboci'
import { SchemaJsonRasy } from 'schemasOrg/rasy'
import { Top } from 'sections/Top/Top'

export async function generateMetadata({ params }: any): Promise<Metadata> {
  const { slug } = await params
  const meta = await getFullServiceMeta(slug)

  if (!meta || !meta.metaData) {
    return {
      title: 'Service Not Found',
      description: '',
    }
  }

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
      'Nehty',
      'Prodlužování řas',
      'Úprava obočí',
    ],
    alternates: {
      canonical: `https://barbitch.cz/service/${slug}`,
    },
  }
}

const Service = async ({ params }: any) => {
  const { slug } = await params

  const [data, dataLink] = await Promise.all([getFullService(slug), getLinkToReserve()])

  return (
    <main>
      {slug === 'oboci' && <SchemaJsonOboci />}
      {slug === 'rasy' && <SchemaJsonRasy />}
      {slug === 'manikura' && <SchemaJsonManikura />}
      <Top title={data.title} small linkToReserve={dataLink.linkToReserve} />
      <DynamicContent data={data.dynamicContent} variant="service" />
    </main>
  )
}

export default Service
