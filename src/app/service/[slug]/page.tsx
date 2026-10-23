import type { Metadata } from 'next'

import { Breadcrumbs } from 'components/Breadcrumbs'
import { DynamicContent } from 'components/DynamicContent'
import { getBookingPricelist } from 'fetch/bookingPricelist'
import { getLinkToReserve } from 'fetch/contact'
import { getFullService, getServiceHomepage } from 'fetch/service'
import { Axios } from 'lib/api'
import { cmsTitle, ogImages } from 'lib/seo'
import { notFound } from 'next/navigation'
import { ServiceSchema } from 'schemasOrg/service'
import {
  getServicesForSlug,
  PRICED_SERVICE_SLUGS,
  ServicePriceSchema,
} from 'schemasOrg/servicePrice'
import { Top } from 'sections/Top/Top'

// Bez toho se stránka vygeneruje jednou při buildu a v Strapi upravená cena
// nebo text se na produkci neobjeví až do dalšího nasazení.
export const revalidate = 3600

export async function generateStaticParams() {
  try {
    const slugServices = (await Axios.get('/api/services?fields[0]=slug')) as {
      slug: string
    }[]

    return slugServices.map((service) => ({
      slug: service.slug,
    }))
  } catch (error) {
    console.error('Failed to fetch service slugs for static params:', error)
    return []
  }
}

export async function generateMetadata({ params }: any): Promise<Metadata> {
  const { slug } = await params
  const data = await getFullService(slug)

  if (!data || !data.metaData) {
    return {
      title: { absolute: 'Služba nenalezena (404) | Barbitch' },
      description: '',
      robots: { index: false, follow: false },
    }
  }

  return {
    title: cmsTitle(data.metaData.title || data.title),
    description: data.metaData.description || '',
    openGraph: {
      title: data.metaData.title || data.title,
      description: data.metaData.description || '',
      siteName: 'Barbitch',
      locale: 'cs_CZ',
      images: ogImages(data.metaData.image?.url, `${data.title} — Barbitch Brno`),
      url: `https://barbitch.cz/service/${slug}`,
      // Stránka služby není článek.
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: data.metaData.title || data.title,
      description: data.metaData.description || '',
      images: ogImages(data.metaData.image?.url, `${data.title} — Barbitch Brno`),
    },
    alternates: {
      canonical: `https://barbitch.cz/service/${slug}`,
    },
  }
}

const Service = async ({ params }: any) => {
  const { slug } = await params

  const isPriced = PRICED_SERVICE_SLUGS.includes(slug)

  const [data, dataLink, pricelist, services] = await Promise.all([
    getFullService(slug),
    getLinkToReserve(),
    isPriced ? getBookingPricelist() : Promise.resolve([]),
    getServiceHomepage(),
  ])

  if (!data) {
    return notFound()
  }

  // Další služba v pořadí z `/api/services` (jako na úvodní stránce), za poslední
  // zase první. `shortTitle` je v CMS psaný různě („obočí“, „Manikúra“).
  const index = services.findIndex((service) => service.slug === slug)
  const nextService =
    index >= 0 && services.length > 1 ? services[(index + 1) % services.length] : undefined
  const nextLabel = nextService?.shortTitle || ''

  return (
    <main>
      {isPriced ? (
        <ServicePriceSchema slug={slug} services={getServicesForSlug(pricelist, slug)} />
      ) : (
        <ServiceSchema name={data.title} url={`https://barbitch.cz/service/${slug}`} />
      )}
      <Top title={data.title} small noMargin linkToReserve={dataLink.linkToReserve} />
      <Breadcrumbs
        items={[
          { name: 'Hlavní strana', url: 'https://barbitch.cz' },
          // Samostatná stránka služeb není — menu vede rovnou na služby, přehled je v ceníku.
          // Do JSON-LD ji nedáváme: Google by u služby ukazoval cestu přes ceník.
          { name: 'Služby', url: 'https://barbitch.cz/cenik', schema: false },
          { name: data.title, url: `https://barbitch.cz/service/${slug}` },
        ]}
        back={{ label: 'Zpět na služby', url: 'https://barbitch.cz/cenik' }}
        next={
          nextService && nextLabel
            ? {
                prefix: 'Další:',
                label: nextLabel.charAt(0).toUpperCase() + nextLabel.slice(1),
                url: `https://barbitch.cz/service/${nextService.slug}`,
              }
            : undefined
        }
      />
      <DynamicContent data={data.dynamicContent} variant={'service'} />
    </main>
  )
}

export default Service
