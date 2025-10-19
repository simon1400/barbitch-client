import type { Metadata } from 'next'

import { DynamicContent } from 'components/DynamicContent'
import { getLinkToReserve } from 'fetch/contact'
import { getFullServiceMeta } from 'fetch/getMeta'
import { getFullService } from 'fetch/service'
import { Axios } from 'lib/api'
import { BreadcrumbSchema } from 'schemasOrg/breadcrumb'
import { SchemaJsonManikura } from 'schemasOrg/manikura'
import { SchemaJsonOboci } from 'schemasOrg/oboci'
import { SchemaJsonRasy } from 'schemasOrg/rasy'
import { Top } from 'sections/Top/Top'

export async function generateStaticParams() {
  const slugServices = (await Axios.get('/api/services?fields[0]=slug')) as { slug: string }[]

  return slugServices.map((service) => ({
    slug: service.slug,
  }))
}

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
      <BreadcrumbSchema
        items={[
          { name: 'Hlavní strana', url: 'https://barbitch.cz' },
          { name: data.title, url: `https://barbitch.cz/service/${slug}` },
        ]}
      />
      {slug === 'oboci' && <SchemaJsonOboci />}
      {slug === 'rasy' && <SchemaJsonRasy />}
      {slug === 'manikura' && <SchemaJsonManikura />}
      <Top title={data.title} small linkToReserve={dataLink.linkToReserve} />
      <DynamicContent data={data.dynamicContent} />
    </main>
  )
}

export default Service
