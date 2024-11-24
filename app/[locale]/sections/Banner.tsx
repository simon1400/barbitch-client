'use client'
import { motion } from 'motion/react'

import Button from '../components/Button'

const duration = 40

export const Banner = ({ linkReserve }: { linkReserve: string }) => {
  return (
    <section
      className={
        'h-screen bg-gradient-to-t from-[#E71E6E] to-[#FF006580] mix-blend-multiply flex items-center justify-center relative z-10 overflow-hidden'
      }
    >
      <div className={`absolute top-[20%] -right-[30%] w-full h-[50px] rotate-45`}>
        <motion.div
          animate={{ x: '-50%' }}
          transition={{ duration, ease: 'linear', repeat: Infinity }}
          className={`w-[200%] h-full bg-[url('/assets/line1.svg')]`}
        />
      </div>
      <div className={`absolute top-[15%] -left-[10%] w-full h-[50px] -rotate-12`}>
        <motion.div
          animate={{ x: '-50%' }}
          transition={{ duration, ease: 'linear', repeat: Infinity }}
          className={`w-[200%] h-full bg-[url('/assets/line2.svg')]`}
        />
      </div>
      <div className={`absolute bottom-[5%] w-full h-[50px] -rotate-3`}>
        <motion.div
          initial={{ x: '-50%' }}
          animate={{ x: '0' }}
          transition={{ duration, ease: 'linear', repeat: Infinity }}
          className={`w-[200%] h-full bg-center bg-[url('/assets/line3.svg')]`}
        />
      </div>

      <div className={'container mx-auto w-full max-w-[800px] px-4'}>
        <h2 className={'text-md1 lg:text-xxl pb-4 text-center'}>
          {'ОФІС ГЕНПРО КУРОРА НАДАВАВ ФІНЛЯНДІЇ'}
        </h2>
        <div className={'flex justify-center'}>
          <Button text={'Rezervovat termin'} href={linkReserve} />
        </div>
      </div>
    </section>
  )
}
