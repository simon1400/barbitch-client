'use client'
import type { IDataNav, INavItem } from 'fetch/nav'

import Image from 'components/Image'
import { useAppContext } from 'context/AppContext'
import dynamic from 'next/dynamic'
import { usePathname } from 'next/navigation'

import { Container } from '../Container'

import { isHalloweenHome } from './darkPage'

const MenuLink = dynamic(() => import('./MenuLink'))
const Button = dynamic(() => import('../Button'))

const HAZARD = 'absolute left-0 w-full h-2.5 lg:h-[14px] bg-hazard-sm lg:bg-hazard'

const Menu = ({ nav, halloween }: { nav: IDataNav; halloween: boolean }) => {
  const { menu: open } = useAppContext()
  const pathname = usePathname()
  const halloweenHome = isHalloweenHome(pathname, halloween)
  return (
    <div
      className={`fixed top-0 left-0 w-full bg-accent z-20 overflow-hidden flex items-end transition-opacity duration-300 ${
        open ? 'opacity-1 h-screen' : 'opacity-0 h-0'
      }`}
      // Žádné `role="menu"`: přebíjelo to landmark <nav> uvnitř a pro čtečku
      // z navigace dělalo aplikační menu (očekává ovládání šipkami).
      aria-label={'Hlavní menu'}
      inert={!open ? true : undefined}
    >
      {halloweenHome && (
        <>
          <div className={`${HAZARD} top-0`} aria-hidden />
          {/* Nálepky jen na desktopu a na dost vysoké obrazovce — jinak by
              zasahovaly do pravého menu. */}
          <Image
            src={'/assets/halloween/sticker-labels.jpg'}
            alt={''}
            width={1280}
            height={807}
            sizes={'420px'}
            className={
              'hidden lg:[@media(min-height:880px)]:block absolute right-[120px] top-[140px] w-[420px] h-auto rotate-6 shadow-[0_30px_50px_rgba(0,0,0,.6)]'
            }
          />
          <div className={`${HAZARD} bottom-0`} aria-hidden />
        </>
      )}
      <Container size={'xl'} className={'relative'}>
        <div className={'text-right lg:text-left'}>
          <nav className={'lg:flex items-center justify-between w-full pb-20'}>
            <div>
              <ul className={'mb-2.5 lg:mb-0 block'} aria-label={'Hlavní navigace'}>
                {/* `?.length &&` vykreslí při prázdném poli literální 0. */}
                {nav.leftNav?.map((item: INavItem) => (
                  <li key={`leftMenu_${item.title}`}>
                    <MenuLink size={'text-sm1 lg:text-lg'} heading={item.title} href={item.link} />
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <ul className={'block text-right'} aria-label={'Doplňková navigace'}>
                {nav.rightNav?.map((item: INavItem) => (
                  <li className={'mt-2 lg:mt-2.5 text-right'} key={`rightMenu_${item.title}`}>
                    <MenuLink
                      size={'text-resLg lg:text-md text-right'}
                      href={item.link}
                      heading={item.title}
                      reverse
                    />
                  </li>
                ))}
              </ul>
            </div>
            <Button
              inverse={open}
              className={'mt-5 lg:hidden'}
              id={'book-button'}
              text={'Rezervovat termín'}
              href={'/book'}
            />
          </nav>
        </div>
      </Container>
    </div>
  )
}

export default Menu
