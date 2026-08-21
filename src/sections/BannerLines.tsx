'use client'
import type { IDataBanner } from 'fetch/banner'

import { getStrapiImageUrl } from 'lib/image-utils'
import { motion } from 'motion/react'
const duration = 40

const BannerLines = ({ data }: { data: IDataBanner }) => {
  // `getBanner()` vrací při výpadku CMS prázdný objekt — bez volitelného
  // přístupu tu spadne prerender každé stránky, protože banner je skoro všude.
  const lines = [data?.animateLine1?.url, data?.animateLine2?.url, data?.animateLine3?.url]

  if (!lines.some(Boolean)) return null

  return (
    <>
      <div className={`absolute top-[20%] -right-[30%] w-full h-[30px] md:h-[50px] rotate-45 z-50`}>
        <motion.div
          animate={{ x: '-50%' }}
          transition={{ duration, ease: 'linear', repeat: Infinity }}
          style={{ backgroundImage: `url(${getStrapiImageUrl(lines[0])})` }}
          className={`w-[200%] h-full bg-contain`}
        />
      </div>
      <div className={`absolute top-[15%] -left-[10%] w-full h-[30px] md:h-[50px] -rotate-12 z-50`}>
        <motion.div
          animate={{ x: '-50%' }}
          transition={{ duration, ease: 'linear', repeat: Infinity }}
          style={{ backgroundImage: `url(${getStrapiImageUrl(lines[1])})` }}
          className={`w-[200%] h-full bg-contain`}
        />
      </div>
      <div className={`absolute bottom-[5%] w-full h-[30px] md:h-[50px] -rotate-3 z-50`}>
        <motion.div
          initial={{ x: '-50%' }}
          animate={{ x: '0' }}
          transition={{ duration, ease: 'linear', repeat: Infinity }}
          style={{ backgroundImage: `url(${getStrapiImageUrl(lines[2])})` }}
          className={`w-[200%] h-full bg-center bg-contain`}
        />
      </div>
    </>
  )
}

export default BannerLines
