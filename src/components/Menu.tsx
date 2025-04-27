import type { IDataNav, INavItem } from 'fetch/nav'

import { motion, useMotionValue } from 'motion/react'
import { useRef } from 'react'

import Button from './Button'
import { Container } from './Container'
// import Lang from './Lang'

interface LinkProps {
  heading: string
  href: string
  size: string
  reverse?: boolean
}

const Link = ({ heading, href, size, reverse = false }: LinkProps) => {
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

const Menu = ({ open, nav }: { open: boolean; nav: IDataNav }) => {
  return (
    <div
      className={`fixed top-0 left-0 w-full bg-accent z-20 overflow-hidden flex items-end transition-opacity duration-300 ${
        open ? 'opacity-1 h-screen' : 'opacity-0 h-0'
      }`}
      role={'menu'}
      aria-hidden={!open}
    >
      <Container size={'xl'}>
        <div className={'text-right lg:text-left'}>
          {/* Языковое меню */}
          {/* <div className={'lg:hidden'}>
            <Lang menu={open} />
          </div> */}
          <div className={'lg:flex items-center justify-between w-full pb-20'}>
            {/* Левая навигация */}
            <div>
              <nav className={'mb-2.5 lg:mb-0'} aria-label={'Основная навигация'}>
                <ul>
                  {nav.leftNav?.length &&
                    nav.leftNav.map((item: INavItem) => (
                      <li key={`leftMenu_${item.title}`}>
                        <Link size={'text-sm1 lg:text-lg'} heading={item.title} href={item.link} />
                      </li>
                    ))}
                </ul>
              </nav>
            </div>
            {/* Правая навигация */}
            <div>
              <nav aria-label={'Дополнительная навигация'}>
                <ul className={'text-right'}>
                  {nav.rightNav?.length &&
                    nav.rightNav.map((item: INavItem) => (
                      <li className={'mt-2 lg:mt-2.5 text-right'} key={`rightMenu_${item.title}`}>
                        <Link
                          size={'text-resLg lg:text-md text-right'}
                          href={item.link}
                          heading={item.title}
                          reverse
                        />
                      </li>
                    ))}
                </ul>
              </nav>
            </div>
            {/* Кнопка */}
            <Button
              inverse={open}
              className={'mt-5 lg:hidden'}
              id={'book-button'}
              text={'Rezervovat termín'}
              href={'/book'}
            />
          </div>
        </div>
      </Container>
    </div>
  )
}

export default Menu
