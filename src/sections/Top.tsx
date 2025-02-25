'use client'

import Button from 'components/Button'
import { motion, useAnimation } from 'motion/react'
import { useEffect } from 'react'
import { useInView } from 'react-intersection-observer'

export const Top = ({ title, small = false }: { title: string; small?: boolean }) => {
  const ctrls = useAnimation()
  const { ref, inView } = useInView({ threshold: 0.5, triggerOnce: true })

  useEffect(() => {
    if (inView) {
      ctrls.start('visible') // Запускаем анимацию только после попадания в viewport
    }
  }, [ctrls, inView])

  // 🔥 Фикс: текст сразу видимый, но плавно "подскакивает"
  const characterAnimation = {
    hidden: { opacity: 1, y: '115%' }, // Убрали opacity: 0 (LCP не тормозится)
    visible: {
      opacity: 1,
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
      animate={{
        backgroundImage: 'linear-gradient(0deg, rgba(231,30,110,1) 0%, rgba(255,0,101,0.5) 100%)',
        transition: { duration: 1.5, ease: [0.2, 0.65, 0.3, 0.9] },
      }}
      className={`${
        small ? 'h-[545px]' : 'h-screen'
      } mix-blend-multiply flex items-end relative z-10`}
    >
      <div
        className={`container mx-auto w-full max-w-[1400px] px-4 ${small ? '' : 'md:min-h-[500px]'}`}
      >
        <div className={'pb-23 md:pb-15'}>
          <h1 id={'top-title'} className={'text-md2 lg:text-top pb-4 uppercase'}>
            {title.split(' ').map((parentWord, parentIdx) => (
              <motion.span
                ref={ref}
                key={parentWord}
                className={
                  'inline-block pt-2 md:-mb-3 mr-[.8rem] md:mr-[3rem] whitespace-nowrap overflow-y-hidden'
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

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 1.5, duration: 0.5 } }}
          >
            <Button
              text={'Rezervovat termin'}
              blank
              id={'book-button'}
              href={'https://noona.app/cs/barbitch'}
              onClick={(e) => {
                e.preventDefault()
                window.open(e.currentTarget.href, '_blank')
              }}
            />
          </motion.div>
        </div>
      </div>
    </motion.section>
  )
}
