import type { IDataBanner } from 'fetch/banner'

import { Container } from 'components/Container'
import { getBanner } from 'fetch/banner'
import { withHiddenRoutes } from 'helpers/withHiddenRoutes'
import dynamic from 'next/dynamic'
import Image from 'next/image'

import Button from '../components/Button'

const BannerLines = dynamic(() => import('./BannerLines'))

const Banner = async () => {
  const data: IDataBanner = await getBanner()

  return (
    <section
      className={
        'h-screen bg-gradient-to-t from-[#E71E6E] to-[#FF006580] mix-blend-multiply flex items-center justify-center relative overflow-hidden'
      }
    >
      <div
        className={
          'mix-blend-multiply bg-[#E71E6E] top-0 left-0 absolute overflow-hidden w-full h-full -z-10 '
        }
      >
        <Image
          src={'/assets/banner.jpg'}
          className={'absolute object-cover object-center grayscale opacity-70 w-full h-full'}
          fill
          alt={
            'Proces manikúry v salonu: nehtová specialistka v růžových rukavicích upravuje nehty zákaznice pomocí přístroje s růžovým povrchem'
          }
          loading={'lazy'}
        />
      </div>
      <BannerLines data={data} />

      <Container size={'md'} className={'z-50'}>
        {!!data.title?.length && (
          <h2 className={'text-md1 lg:text-big pb-4 text-center uppercase text-white'}>
            {data.title}
          </h2>
        )}
        {data?.cta && (
          <div className={'flex justify-center'}>
            <Button text={data.cta.title} white href={data.cta.link} />
          </div>
        )}
      </Container>
    </section>
  )
}

export default withHiddenRoutes(Banner, ['/book', '/kontakt'])
