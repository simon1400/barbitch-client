'use client'
import type { IDataBanner } from 'fetch/banner'

import { motion } from 'motion/react'
import { usePathname } from 'next/navigation'

import Button from '../components/Button'

const duration = 40

export const Banner = ({ data }: { data: IDataBanner }) => {
  const pathname = usePathname()

  if (pathname === '/kontakt' || pathname === '/reservation') {
    return null
  }

  return (
    <section
      className={
        'h-screen bg-gradient-to-t from-[#E71E6E] to-[#FF006580] mix-blend-multiply flex items-center justify-center relative overflow-hidden'
      }
    >
      <div className={`absolute top-[20%] -right-[30%] w-full h-[30px] md:h-[50px] rotate-45 z-50`}>
        <motion.div
          animate={{ x: '-50%' }}
          transition={{ duration, ease: 'linear', repeat: Infinity }}
          style={{ backgroundImage: `url(${data.animateLine1.url})` }}
          className={`w-[200%] h-full bg-contain`}
        />
      </div>
      <div className={`absolute top-[15%] -left-[10%] w-full h-[30px] md:h-[50px] -rotate-12 z-50`}>
        <motion.div
          animate={{ x: '-50%' }}
          transition={{ duration, ease: 'linear', repeat: Infinity }}
          style={{ backgroundImage: `url(${data.animateLine2.url})` }}
          className={`w-[200%] h-full bg-contain`}
        />
      </div>
      <div className={`absolute bottom-[5%] w-full h-[30px] md:h-[50px] -rotate-3 z-50`}>
        <motion.div
          initial={{ x: '-50%' }}
          animate={{ x: '0' }}
          transition={{ duration, ease: 'linear', repeat: Infinity }}
          style={{ backgroundImage: `url(${data.animateLine3.url})` }}
          className={`w-[200%] h-full bg-center bg-contain`}
        />
      </div>

      <div className={'container mx-auto w-full max-w-[800px] px-4 z-50'}>
        {!!data.title?.length && (
          <h2 className={'text-md1 lg:text-big pb-4 text-center'}>{data.title}</h2>
        )}
        {data?.cta && (
          <div className={'flex justify-center'}>
            <Button text={data.cta.title} id={'book-button'} blank href={data.cta.link} />
          </div>
        )}
      </div>
    </section>
  )
}
