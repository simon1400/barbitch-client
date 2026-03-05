import type { Metadata } from 'next'

import { DynamicContent } from 'components/DynamicContent'
import { getLinkToReserve } from 'fetch/contact'
import { getFullService } from 'fetch/service'
import { Axios } from 'lib/api'
import { getStrapiImageUrl } from 'lib/image-utils'
import { BreadcrumbSchema } from 'schemasOrg/breadcrumb'
import { SchemaJsonManikura } from 'schemasOrg/manikura'
import { SchemaJsonOboci } from 'schemasOrg/oboci'
import { SchemaJsonRasy } from 'schemasOrg/rasy'
import { ServiceSchema } from 'schemasOrg/service'
import { Top } from 'sections/Top/Top'

export async function generateStaticParams() {
  const slugServices = (await Axios.get('/api/services?fields[0]=slug')) as { slug: string }[]

  return slugServices.map((service) => ({
    slug: service.slug,
  }))
}

export async function generateMetadata({ params }: any): Promise<Metadata> {
  const { slug } = await params
  const data = await getFullService(slug)

  if (!data || !data.metaData) {
    return {
      title: 'Service Not Found',
      description: '',
    }
  }

  return {
    title: data.metaData.title || data.title,
    description: data.metaData.description || '',
    openGraph: {
      title: data.metaData.title || data.title,
      description: data.metaData.description || '',
      siteName: 'Barbitch',
      images: [getStrapiImageUrl(data.metaData.image?.url)],
      url: `https://barbitch.cz/service/${slug}`,
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: data.metaData.title || data.title,
      description: data.metaData.description || '',
      images: [getStrapiImageUrl(data.metaData.image?.url)],
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
      {slug !== 'oboci' && slug !== 'rasy' && slug !== 'manikura' && (
        <ServiceSchema name={data.title} url={`https://barbitch.cz/service/${slug}`} />
      )}
      <Top title={data.title} small linkToReserve={dataLink.linkToReserve} />
      <DynamicContent data={data.dynamicContent} variant={'service'} />
    </main>
  )
}

export default Service
