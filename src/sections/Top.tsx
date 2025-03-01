'use client'

import Button from 'components/Button'
import { motion, useAnimation } from 'motion/react'
import { useEffect } from 'react'

export const Top = ({ title, small = false }: { title: string; small?: boolean }) => {
  const ctrls = useAnimation()
  const backgroundAnimation = useAnimation()
  const buttonAnimation = useAnimation()

  const handleAnimation = () => {
    if (window.innerWidth >= 768) {
      ctrls.start('visible')
      backgroundAnimation.start({
        backgroundImage: 'linear-gradient(0deg, rgba(231,30,110,1) 0%, rgba(255,0,101,0.5) 100%)',
        transition: { duration: 1.5, ease: [0.2, 0.65, 0.3, 0.9] },
      })
      buttonAnimation.start({ opacity: 1, y: 0, transition: { delay: 1.5, duration: 0.5 } })
    } else {
      ctrls.set('visible')
      backgroundAnimation.set({
        backgroundImage: 'linear-gradient(0deg, rgba(231,30,110,1) 0%, rgba(255,0,101,0.5) 100%)',
        transition: { duration: 1.5, ease: [0.2, 0.65, 0.3, 0.9] },
      })
      buttonAnimation.set({ opacity: 1, y: 0, transition: { delay: 1.5, duration: 0.5 } })
    }
  }

  useEffect(() => {
    handleAnimation()
  })

  const characterAnimation = {
    hidden: { y: '115%' },
    visible: {
      y: 0,
      transition: { duration: 1, ease: [0.2, 0.65, 0.3, 0.9] },
    },
  }

  return (
    <motion.section
      aria-labelledby={'top-title'}
      initial={{
        backgroundImage: 'linear-gradient(0deg, rgba(231,30,110,1) 0%, rgba(255,0,101,0.5) 0%)',
      }}
      animate={backgroundAnimation}
      className={`${
        small ? 'h-[545px]' : 'h-screen md:min-h-[800px]'
      } mix-blend-multiply flex items-end relative z-10`}
    >
      <div
        className={`container mx-auto w-full max-w-[1400px] px-4 ${small ? '' : 'md:min-h-[500px]'}`}
      >
        <div className={'pb-23 md:pb-15 max-w-[650px]'}>
          <h1 id={'top-title'} className={'text-md2 lg:text-top pb-4 uppercase'}>
            {title.split(' ').map((parentWord, parentIdx) => (
              <motion.span
                key={parentWord}
                className={
                  'inline-block pt-2 md:-mb-3 mr-[.8rem] md:mr-[2rem] whitespace-nowrap overflow-y-hidden'
                }
                initial={'hidden'}
                animate={ctrls} // Анимация запускается только после inView
                variants={{ hidden: {}, visible: {} }}
                transition={{ delayChildren: parentIdx * 0.3, staggerChildren: 0.05 }}
              >
                {parentWord.split('').map((character, index) => (
                  <motion.span
                    key={character + index}
                    className={'inline-block'}
                    variants={characterAnimation}
                  >
                    {character}
                  </motion.span>
                ))}
              </motion.span>
            ))}
          </h1>

          <motion.div initial={{ opacity: 0, y: -20 }} animate={buttonAnimation}>
            <Button
              text={'Rezervovat termín'}
              blank
              id={'book-button'}
              href={'https://noona.app/cs/barbitch'}
            />
          </motion.div>
        </div>
      </div>
    </motion.section>
  )
}
