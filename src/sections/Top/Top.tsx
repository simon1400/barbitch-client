'use client'

import Button from 'components/Button'
import { handleAnimation } from 'helpers/topAnimation'
import { motion, useAnimation } from 'motion/react'
import { useEffect } from 'react'

import { TopContent } from './TopContent'

export const Top = ({ title, small = false }: { title: string; small?: boolean }) => {
  const ctrls = useAnimation()
  const backgroundAnimation = useAnimation()
  const buttonAnimation = useAnimation()

  useEffect(() => {
    handleAnimation(ctrls, backgroundAnimation, buttonAnimation)
  })

  return (
    <motion.section
      aria-labelledby={'top-title'}
      initial={{
        backgroundImage: 'linear-gradient(0deg, rgba(231,30,110,1) 0%, rgba(255,0,101,0.5) 0%)',
      }}
      animate={backgroundAnimation}
      className={`${
        small ? 'h-[545px]' : 'h-screen md:min-h-[800px]'
      } mix-blend-multiply flex items-end relative z-10 mb-13.5`}
    >
      <div
        className={`container mx-auto w-full max-w-[1400px] px-4 ${small ? '' : 'md:min-h-[500px]'}`}
      >
        <div className={`${small ? 'pb-10' : 'pb-23'} md:pb-15 max-w-[650px]`}>
          <TopContent title={title} ctrls={ctrls} />

          <motion.div initial={{ opacity: 0, y: -20 }} animate={buttonAnimation}>
            <Button text={'Rezervovat termín'} id={'book-button'} href={'/reservation'} />
          </motion.div>
        </div>
      </div>
    </motion.section>
  )
}
