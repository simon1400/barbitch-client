import type { Metadata } from 'next'

import Button from 'components/Button'
import { MasonryGalery } from 'components/MansoryGalery'
import { getFullService, getFullServiceMeta } from 'fetch/service'
import parse from 'html-react-parser'
import { SchemaJsonManikura } from 'schemasOrg/manikura'
import { SchemaJsonOboci } from 'schemasOrg/oboci'
import { SchemaJsonRasy } from 'schemasOrg/rasy'

import { Top } from '../../../sections/Top'

export async function generateMetadata({ params }: any): Promise<Metadata> {
  const { slug } = params
  const meta = await getFullServiceMeta(slug)

  return {
    title: meta.metaData.title || meta.title,
    description: meta.metaData.description || '',
    openGraph: meta.metaData.image
      ? {
          title: meta.metaData.title || meta.title,
          description: meta.metaData.description || '',
          siteName: 'Bar.bitch – Luxusní manikúra, obočí a řasy',
          images: [meta.metaData.image.url],
          url: `https://barbitch.cz/${slug}`,
          type: 'article',
        }
      : null,
    twitter: {
      card: 'summary_large_image',
      title: meta.metaData.title || meta.title,
      description: meta.metaData.description || '',
      images: meta.metaData.image ? [meta.metaData.image.url] : undefined,
    },
  }
}

const Section = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <section className={`pt-10 pb-16 ${className || ''}`}>
    <div className={'container mx-auto w-full max-w-[1400px] px-4'}>{children}</div>
  </section>
)

const Service = async ({ params }: any) => {
  const { slug } = params
  const data = await getFullService(slug)

  return (
    <main>
      {slug === 'oboci' && <SchemaJsonOboci />}
      {slug === 'rasy' && <SchemaJsonRasy />}
      {slug === 'manikura' && <SchemaJsonManikura />}
      <Top title={data.title} small />
      <Section>
        <div className={'text-xs1 lg:text-base'}>
          {parse(data.description || '', { trim: true })}
        </div>
      </Section>
      {data.galery?.length > 0 && <MasonryGalery images={data.galery} />}
      <Section>
        <div className={'text-xs1 lg:text-base'}>
          {parse(data.additionalDescription || '', { trim: true })}
        </div>
        <Button
          className={'mt-5'}
          text={'Rezervovat termin'}
          href={'https://noona.app/cs/barbitch'}
        />
      </Section>
    </main>
  )
}

export default Service
