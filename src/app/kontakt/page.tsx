import type { Metadata } from 'next'

import { Container } from 'components/Container'
import { getContactContent, getLinkToReserve } from 'fetch/contact'
import { getContactMeta } from 'fetch/getMeta'
import { parseHtml } from 'lib/parseHtml'
import { cmsTitle, ogImages } from 'lib/seo'
import { BreadcrumbSchema } from 'schemasOrg/breadcrumb'
import { LocalBusinessSchema } from 'schemasOrg/localBusiness'
import { Top } from 'sections/Top/Top'

export const revalidate = 3600

export async function generateMetadata(): Promise<Metadata> {
  const data = await getContactMeta()

  return {
    // Bez fallbacku by výpadek CMS znamenal prázdný <title>.
    title: cmsTitle(
      data.metaData.title || 'Kontakt – Barbitch Beauty Studio, Křenová 294/16, Brno',
    ),
    description:
      data.metaData.description ||
      'Najdete nás na Křenové 294/16 v centru Brna. Otevřeno denně 10:00–19:00. Objednejte se online nebo nám zavolejte.',
    openGraph: {
      title: data.metaData.title || 'Kontakt – Barbitch Beauty Studio Brno',
      description: data.metaData.description || '',
      siteName: 'Barbitch',
      locale: 'cs_CZ',
      images: ogImages(data.metaData.image?.url, 'Barbitch Beauty Studio, Křenová 294/16, Brno'),
      url: `https://barbitch.cz/kontakt`,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: data.metaData.title || 'Kontakt',
      description: data.metaData.description || '',
      images: ogImages(data.metaData.image?.url, 'Barbitch Beauty Studio, Křenová 294/16, Brno'),
    },
    alternates: {
      canonical: `https://barbitch.cz/kontakt`,
    },
  }
}

const Contact = async () => {
  const [dataLink, dataContent] = await Promise.all([getLinkToReserve(), getContactContent()])
  return (
    <main>
      <BreadcrumbSchema
        items={[
          { name: 'Hlavní strana', url: 'https://barbitch.cz' },
          { name: 'Kontakt', url: 'https://barbitch.cz/kontakt' },
        ]}
      />
      <LocalBusinessSchema />
      <Top title={'Kontakt'} small linkToReserve={dataLink.linkToReserve} />
      <Container size={'md'}>
        <div className={'content'}>{parseHtml(dataContent.content)}</div>
      </Container>
    </main>
  )
}

export default Contact
