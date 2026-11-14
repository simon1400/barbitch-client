import type { IDataBanner } from 'fetch/banner'

import { Container } from 'components/Container'
import Image from 'components/Image'
import { getBanner, getBannerSubtitle } from 'fetch/banner'
import dynamic from 'next/dynamic'

import Button from '../components/Button'

const BannerLines = dynamic(() => import('./BannerLines'))

const Banner = async () => {
  const [data, subtitle]: [IDataBanner, string] = await Promise.all([
    getBanner(),
    getBannerSubtitle(),
  ])

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
          quality={75}
          sizes={'100vw'}
          placeholder={'blur'}
          blurDataURL={
            'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=='
          }
        />
      </div>
      <BannerLines data={data} />

      {/* min-w-0: jinak flex nedovolí nadpisu zalomit se a na 375 px přetekl (s286) */}
      <Container size={'md'} className={'z-50 min-w-0'}>
        {!!data.title?.length && (
          <h2
            className={
              'text-[clamp(26px,8.2vw,34px)] font-extrabold leading-[1.03] md:text-md1 lg:text-big pb-4 text-center uppercase text-white'
            }
          >
            {data.title}
          </h2>
        )}
        {!!subtitle && (
          <p
            className={
              'mx-auto mb-6 max-w-[560px] text-center text-[17px] lg:text-[22px] leading-[1.35] font-extrabold text-white'
            }
          >
            {subtitle}
          </p>
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

export default Banner
