import { getInsidePage } from 'fetch/insidePage'
import parse from 'html-react-parser'

import Button from '../components/Button'
import { MasonryGalery } from '../components/MansoryGalery'
import { Top } from '../sections/Top'

const Service = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const data = await getInsidePage((await params).slug)

  return (
    <main>
      <Top title={data.title} small />
      <section className={'pt-10 pb-16'}>
        <div className={'container mx-auto w-full max-w-[1400px] px-4'}>
          <div className={'w-full mb-5 lg:mb-0'}>
            <div className={'text-xs1 lg:text-base'}>{parse(data.description)}</div>
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
