'use client'
import { motion } from 'motion/react'
import { useCallback, useEffect, useRef, useState } from 'react'

export const InfiniteLooper = ({
  speed,
  children,
}: {
  speed: number
  children: React.ReactNode
}) => {
  const [looperInstances, setLooperInstances] = useState(1)
  const outerRef = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)

  const setupInstances = useCallback(() => {
    if (!innerRef?.current || !outerRef?.current) return

    const { width } = innerRef.current.getBoundingClientRect()

    const { width: parentWidth } = outerRef.current.getBoundingClientRect()

    const instanceWidth = width / innerRef.current.children.length

    if (width < parentWidth + instanceWidth) {
      setLooperInstances(looperInstances + Math.ceil(parentWidth / width))
    }
    resetAnimation()
  }, [looperInstances])

  useEffect(() => {
    setupInstances()
  }, [])

  useEffect(() => {
    window.addEventListener('resize', setupInstances)

    return () => {
      window.removeEventListener('resize', setupInstances)
    }
  }, [])

  function resetAnimation() {
    if (innerRef?.current) {
      innerRef.current.setAttribute('data-animate', 'false')

      setTimeout(() => {
        if (innerRef?.current) {
          innerRef.current.setAttribute('data-animate', 'true')
        }
      }, 50)
    }
  }

  return (
    <div className={'w-full overflow-x-hidden overflow-y-visible py-5'} ref={outerRef}>
      <div className={'flex justify-center w-fit'} ref={innerRef}>
        {[...Array.from({ length: looperInstances })].map((_, ind) => (
          <motion.div
            initial={{ x: '0%' }}
            animate={{ x: '-100%' }}
            transition={{
              duration: speed,
              repeat: Infinity,
              ease: 'linear',
            }}
            // eslint-disable-next-line react/no-array-index-key, sonarjs/no-array-index-key
            key={ind}
            className={'flex w-max'}
          >
            {children}
          </motion.div>
        ))}
      </div>
    </div>
  )
}
