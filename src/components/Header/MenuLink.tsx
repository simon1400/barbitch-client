import { motion, useMotionValue } from 'motion/react'
import { useRef } from 'react'

interface LinkProps {
  heading: string
  href: string
  size: string
  reverse?: boolean
}

const MenuLink = ({ heading, href, size, reverse = false }: LinkProps) => {
  const ref = useRef<HTMLAnchorElement | null>(null)

  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    const rect = ref.current!.getBoundingClientRect()

    const width = rect.width
    const height = rect.height

    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top

    const xPct = mouseX / width - 0.5
    const yPct = mouseY / height - 0.5

    x.set(xPct)
    y.set(yPct)
  }

  return (
    <motion.a
      href={href}
      ref={ref}
      onMouseMove={handleMouseMove}
      initial={'initial'}
      whileHover={'whileHover'}
      className={'uppercase group relative transition-colors'}
      aria-label={heading}
    >
      <div>
        <motion.span
          variants={{
            initial: { x: 0 },
            whileHover: { x: reverse ? 16 : -16 },
          }}
          transition={{
            type: 'spring',
            staggerChildren: 0.075,
            delayChildren: 0.25,
          }}
          className={`relative z-10 block text-white transition-colors group-hover:text-primary ${size}`}
        >
          {heading.split('').map((l, i) => (
            <motion.span
              variants={{
                initial: { x: 0 },
                whileHover: { x: reverse ? -16 : 16 },
              }}
              transition={{ type: 'spring', duration: 0.4 }}
              className={'inline-block'}
              key={i}
            >
              {l}
            </motion.span>
          ))}
        </motion.span>
      </div>
    </motion.a>
  )
}

export default MenuLink
