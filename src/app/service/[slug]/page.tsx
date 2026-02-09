import type { Metadata } from 'next'

import { DynamicContent } from 'components/DynamicContent'
import { getLinkToReserve } from 'fetch/contact'
import { getFullServiceMeta } from 'fetch/getMeta'
import { getFullService } from 'fetch/service'
import { Axios } from 'lib/api'
import { getStrapiImageUrl } from 'lib/image-utils'
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
      images: [getStrapiImageUrl(meta.metaData.image?.url)],
      url: `https://barbitch.cz/service/${slug}`,
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: meta.metaData.title || meta.title,
      description: meta.metaData.description || '',
      images: [getStrapiImageUrl(meta.metaData.image?.url)],
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
      <DynamicContent data={data.dynamicContent} variant="service" />
    </main>
  )
}

export default Service
