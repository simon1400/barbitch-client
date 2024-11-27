'use client'

import type { IDataNav, INavItem } from 'fetch/nav'

// import { Link } from 'i18n/routing'

import Button from './Button'
import Lang from './Lang'
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react'
import { useRef } from 'react'
export const Menu = ({ open, nav }: { open: boolean; nav: IDataNav }) => {
  return (
    <menu
      className={`fixed top-0 left-0  w-full bg-accent z-20 overflow-hidden flex items-end transition-opacity duration-300 ${open ? 'opacity-1 h-screen' : 'opacity-0 h-0'}`}
    >
      <div className={'container mx-auto max-w-[1400px] px-4'}>
        <div className={'text-right lg:text-left'}>
          <div className={'lg:hidden'}>
            <Lang menu={open} />
          </div>
          <div className={'lg:flex items-center justify-between w-full pb-5 lg:pb-13'}>
            <div>
              <nav className={'mb-2.5 lg:mb-0'}>
                <ul>
                  {nav.leftNav?.length &&
                    nav.leftNav.map((item: INavItem) => (
                      <li key={`leftMenu_${item.title}`}>
                        <Link
                        size={'text-sm1 lg:text-lg'}
                          heading={item.title}
                          href={item.link}
                        />
                      </li>
                    ))}
                </ul>
              </nav>
            </div>
            <div>
              <nav>
                <ul className={'text-right'}>
                  {nav.rightNav?.length &&
                    nav.rightNav.map((item: INavItem) => (
                      <li className={'mt-0.5 lg:mt-2.5 text-right'} key={`rightMenu_${item.title}`}>
                        <Link
                          size={'text-sm lg:text-md text-right'}
                          href={item.link}
                          heading={item.title}
                        />
                      </li>
                    ))}
                </ul>
              </nav>
            </div>
            <Button
              inverse={open}
              className={'mt-5 lg:hidden'}
              text={'Rezervovat termin'}
              href={'https://noona.app/cs/barbitch'}
            />
          </div>
        </div>
      </div>
    </menu>
  )
}
interface LinkProps {
  heading: string;
  href: string;
  size: string;
}

const Link = ({ heading, href, size }: LinkProps) => {
  const ref = useRef<HTMLAnchorElement | null>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const handleMouseMove = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    const rect = ref.current!.getBoundingClientRect();

    const width = rect.width;
    const height = rect.height;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  return (
    <motion.a
      href={href}
      ref={ref}
      onMouseMove={handleMouseMove}
      initial="initial"
      whileHover="whileHover"
      className="uppercase group relative transition-colors "
    >
      <div>
        <motion.span
          variants={{
            initial: { x: 0 },
            whileHover: { x: -16 },
          }}
          transition={{
            type: "spring",
            staggerChildren: 0.075,
            delayChildren: 0.25,
          }}
          className={`relative z-10 block text-white transition-colors group-hover:text-primary ${size}`}
        >
          {heading.split("").map((l, i) => (
            <motion.span
              variants={{
                initial: { x: 0 },
                whileHover: { x: 16 },
              }}
              transition={{ type: "spring" }}
              className="inline-block"
              key={i}
            >
              {l}
            </motion.span>
          ))}
        </motion.span>
      </div>
    </motion.a>
  );
};