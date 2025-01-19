import { getFullService, getFullServiceMeta } from 'fetch/service'

import parse from 'html-react-parser'
import Button from 'components/Button'
import { MasonryGalery } from 'components/MansoryGalery'
import { Top } from '../../../sections/Top'
import { Metadata } from 'next'

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {

    const slug = (await params).slug
 
  const meta = await getFullServiceMeta(slug)
 
  return {
    title: meta.metaData.title || meta.title,
    description: meta.metaData.description,
    openGraph: meta.metaData.image ? ({
      images: [meta.metaData.image.url],
    }) : null,
  }
}

const Service = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const data = await getFullService((await params).slug)

  return (
    <main>
      <Top title={data.title} small />
      <section className={'pt-10 pb-16'}>
        <div className={'container mx-auto w-full max-w-[1400px] px-4'}>
          <div className={'w-full mb-5 lg:mb-0'}>
            <div className={'text-xs1 lg:text-base'}>{parse(data.description, { trim: true })}</div>
          </div>
        </div>
      </section>
      <MasonryGalery images={data.galery} />
      <section className={'pt-10 pb-16'}>
        <div className={'container mx-auto w-full max-w-[1400px] px-4'}>
          <div className={'w-full mb-5 lg:mb-0'}>
            <div className={'text-xs1 lg:text-base'}>{parse(data.additionalDescription)}</div>
          </div>
          <Button
            className={'mt-5'}
            text={'Rezervovat termin'}
            href={'https://noona.app/cs/barbitch'}
          />
        </div>
      </section>
    </main>
  )
}

export default Service
