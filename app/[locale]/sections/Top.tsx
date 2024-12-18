'use client'
// import { useOnMountUnsafe } from 'app/helpers/useOnMountUnsaf'
import { motion, useAnimation } from 'motion/react'
import { useTranslations } from 'next-intl'
import { useEffect } from 'react'
import { useInView } from 'react-intersection-observer'

import Button from '../components/Button'

export const Top = ({ title, small = false }: { title: string; small?: boolean }) => {
  const t = useTranslations('Global')

  const ctrls = useAnimation()

  const { ref, inView } = useInView({
    threshold: 0.5,
    triggerOnce: true,
  })

  useEffect(() => {
    if (inView) {
      ctrls.start('visible')
    }
    if (!inView) {
      ctrls.start('hidden')
    }
  }, [ctrls, inView])

  const characterAnimation = {
    hidden: {
      opacity: 0,
      y: 80,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1,
        ease: [0.2, 0.65, 0.3, 0.9],
      },
    },
  }

  const wordAnimation = {
    hidden: {},
    visible: {},
  }

  return (
    <motion.section
      initial={{
        backgroundImage: 'linear-gradient(0deg, rgba(231,30,110,1) 0%, rgba(255,0,101,0.5) 0%)',
      }}
      animate={{
        backgroundImage: 'linear-gradient(0deg, rgba(231,30,110,1) 0%, rgba(255,0,101,0.5) 100%)',
        transition: {
          duration: 1.5,
          ease: [0.2, 0.65, 0.3, 0.9],
        },
      }}
      className={`${small ? 'h-[545px]' : 'h-screen'} mix-blend-multiply flex items-end relative z-10`}
    >
      <div className={'container mx-auto w-full max-w-[1400px] px-4'}>
        <div className={'pb-10 lg:pb-15'}>
          {title.split(' ').map((parentWord, parentIdx) => (
            <h1
              key={parentWord}
              className={'text-md1 lg:text-top pb-4 uppercase'}
              aria-label={title}
              role={'heading'}
            >
              {parentWord.split(' ').map((word, index) => {
                return (
                  <motion.span
                    ref={ref}
                    key={word + index}
                    className={'inline-block mr-[0.25rem] whitespace-nowrap'}
                    aria-hidden={'true'}
                    initial={'hidden'}
                    animate={ctrls}
                    variants={wordAnimation}
                    transition={{
                      delayChildren: parentIdx * 0.5 + index * 0.25,
                      staggerChildren: 0.05,
                    }}
                  >
                    {word.split('').map((character: string, index: number) => (
                      <motion.span
                        aria-hidden={'true'}
                        key={character + index}
                        variants={characterAnimation}
                        className={'inline-block'}
                      >
                        {character}
                      </motion.span>
                    ))}
                  </motion.span>
                )
              })}
            </h1>
          ))}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 2, duration: 0.5 } }}
          >
            <Button text={t('reserve')} blank href={'https://noona.app/cs/barbitch'} />
          </motion.div>
        </div>
      </div>
    </motion.section>
  )
}
