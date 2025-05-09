'use client'

import Button from 'components/Button'
import { Container } from 'components/Container'
import { motion, useAnimation } from 'motion/react'
import { useEffect } from 'react'

export const Top = ({
  title,
  small = false,
  linkToReserve,
}: {
  title: string
  small?: boolean
  linkToReserve: string
}) => {
  const backgroundAnimation = useAnimation()

  useEffect(() => {
    if (window.innerWidth >= 768) {
      backgroundAnimation.start({
        backgroundImage: `linear-gradient(0deg, rgba(231,30,110,1) 0%, rgba(255,0,101,0.5) 100%)`,
        transition: { duration: 1.5, ease: [0.2, 0.65, 0.3, 0.9] },
      })
    } else {
      backgroundAnimation.set({
        backgroundImage: `linear-gradient(0deg, rgba(231,30,110,1) 0%, rgba(255,0,101,0.5) 100%)`,
        transition: { duration: 1.5, ease: [0.2, 0.65, 0.3, 0.9] },
      })
    }
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
      <Container size={'xl'} className={small ? '' : 'md:min-h-[500px]'}>
        <div className={`${small ? 'pb-10' : 'pb-23'} md:pb-15 max-w-[650px]`}>
          <h1 id={'top-title'} className={'text-md2 lg:text-top pb-4 uppercase'}>
            {title}
          </h1>

          {!!linkToReserve.length && (
            <div>
              <Button text={'Rezervovat termín'} id={'book-button'} href={linkToReserve} />
            </div>
          )}
        </div>
      </Container>
    </motion.section>
  )
}
