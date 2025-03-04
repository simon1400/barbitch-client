import type { AnimationControls } from 'motion/react'

import { motion } from 'motion/react'

export const TopContent = ({ title, ctrls }: { title: string; ctrls: AnimationControls }) => {
  const characterAnimation = {
    hidden: { y: '115%' },
    visible: {
      y: 0,
      transition: { duration: 1, ease: [0.2, 0.65, 0.3, 0.9] },
    },
  }

  return (
    <h1 id={'top-title'} className={'text-md2 lg:text-top pb-4 uppercase'}>
      <span className={'sr-only'}>{title}</span>
      {title.split(' ').map((parentWord, parentIdx) => (
        <motion.span
          key={parentWord}
          aria-hidden
          className={
            'inline-block pt-2 md:-mb-3 mr-[.8rem] md:mr-[2rem] whitespace-nowrap overflow-y-hidden'
          }
          initial={'hidden'}
          animate={ctrls} // Анимация запускается только после inView
          variants={{ hidden: {}, visible: {} }}
          transition={{ delayChildren: parentIdx * 0.3, staggerChildren: 0.05 }}
        >
          {parentWord
            .replaceAll(';sp;', ' ')
            .split('')
            .map((character, index) => (
              <motion.span
                key={character + index}
                className={`inline-block${character === ' ' ? ' min-w-2 md:min-w-10' : ''}`}
                variants={characterAnimation}
              >
                {character}
              </motion.span>
            ))}
        </motion.span>
      ))}
    </h1>
  )
}
