import type { Metadata } from 'next'

import Button from 'components/Button'
import { MasonryGalery } from 'components/MansoryGalery'
import { getFullService, getFullServiceMeta } from 'fetch/service'
import parse from 'html-react-parser'

import { Top } from '../../../sections/Top'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const meta = await getFullServiceMeta(slug)

  return {
    title: meta.metaData.title || meta.title,
    description: meta.metaData.description,
    openGraph: meta.metaData.image ? { images: [meta.metaData.image.url] } : null,
  }
}

const Section = ({ children }: { children: React.ReactNode }) => (
  <section className={'pt-10 pb-16'}>
    <div className={'container mx-auto w-full max-w-[1400px] px-4'}>{children}</div>
  </section>
)

const Service = async ({ params }: Props) => {
  const { slug } = await params
  const data = await getFullService(slug)

  return (
    <main>
      <Top title={data.title} small />
      <Section>
        <div className={'text-xs1 lg:text-base'}>{parse(data.description, { trim: true })}</div>
      </Section>
      <MasonryGalery images={data.galery} />
      <Section>
        <div className={'text-xs1 lg:text-base'}>{parse(data.additionalDescription)}</div>
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
