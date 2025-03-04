import type { AnimationControls } from 'motion/react'

export const handleAnimation = (
  ctrls: AnimationControls,
  backgroundAnimation: AnimationControls,
  buttonAnimation: AnimationControls,
  additionalAnimation?: string,
) => {
  if (window.innerWidth >= 768) {
    ctrls.start('visible')
    backgroundAnimation.start({
      backgroundImage: `linear-gradient(0deg, rgba(231,30,110,1) 0%, rgba(255,0,101,0.5) 100%)${additionalAnimation || ''}`,
      transition: { duration: 1.5, ease: [0.2, 0.65, 0.3, 0.9] },
    })
    buttonAnimation.start({ opacity: 1, y: 0, transition: { delay: 1.5, duration: 0.5 } })
  } else {
    ctrls.set('visible')
    backgroundAnimation.set({
      backgroundImage: `linear-gradient(0deg, rgba(231,30,110,1) 0%, rgba(255,0,101,0.5) 100%)${additionalAnimation || ''}`,
      transition: { duration: 1.5, ease: [0.2, 0.65, 0.3, 0.9] },
    })
    buttonAnimation.set({ opacity: 1, y: 0, transition: { delay: 1.5, duration: 0.5 } })
  }
}
