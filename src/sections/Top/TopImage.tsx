'use client'

import { handleAnimation } from 'helpers/topAnimation'
import { useAnimation } from 'motion/react'
import Image from 'next/image'
import { useEffect } from 'react'

import { TopContent } from './TopContent'

export const TopImage = ({ title, image }: { title: string; image: IGalery }) => {
  const ctrls = useAnimation()
  const backgroundAnimation = useAnimation()
  const buttonAnimation = useAnimation()

  useEffect(() => {
    handleAnimation(ctrls, backgroundAnimation, buttonAnimation)
  })

  return (
    <div
      aria-labelledby={'top-title'}
      className={`h-[80vh] md:min-h-[500px] flex items-end relative z-10 text-white mb-13.5`}
      style={{
        backgroundImage: 'linear-gradient(0deg, rgba(231,30,110,1) 0%, rgba(255,0,101,0.5) 100%)',
      }}
    >
      <div className={'mix-blend-multiply absolute h-full w-full -z-10 bg-cover bg-center'}>
        <Image
          className={'object-cover object-center opacity-70 grayscale'}
          src={image?.url || '/assets/bigBaner.jpg'}
          fill
          alt={image?.alternativeText || ''}
        />
      </div>

      <div className={`container mx-auto w-full max-w-[1400px] px-4`}>
        <div className={'pb-23 md:pb-15 max-w-[650px]'}>
          <TopContent title={title} ctrls={ctrls} />
        </div>
      </div>
    </div>
  )
}
