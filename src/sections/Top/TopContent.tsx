import type { AnimationControls } from 'motion/react'

// import { motion } from 'motion/react'

export const TopContent = ({ title, ctrls }: { title: string; ctrls: AnimationControls }) => {
  return (
    <h1 id={'top-title'} className={'text-md2 lg:text-top pb-4 uppercase'}>
      {title}
    </h1>
  )
}
