'use client'
import type { IDataNav, INavItem } from 'fetch/nav'

import { useAppContext } from 'context/AppContext'
import dynamic from 'next/dynamic'

import { Container } from '../Container'

const MenuLink = dynamic(() => import('./MenuLink'))
const Button = dynamic(() => import('../Button'))

const Menu = ({ nav }: { nav: IDataNav }) => {
  const { menu: open } = useAppContext()
  return (
    <div
      className={`fixed top-0 left-0 w-full bg-accent z-20 overflow-hidden flex items-end transition-opacity duration-300 ${
        open ? 'opacity-1 h-screen' : 'opacity-0 h-0'
      }`}
      role={'menu'}
      aria-hidden={!open}
      aria-label={'Основное меню'}
    >
      <Container size={'xl'}>
        <div className={'text-right lg:text-left'}>
          <nav className={'lg:flex items-center justify-between w-full pb-20'}>
            <div>
              <ul className={'mb-2.5 lg:mb-0 block'} aria-label={'Основная навигация'}>
                {nav.leftNav?.length &&
                  nav.leftNav.map((item: INavItem) => (
                    <li key={`leftMenu_${item.title}`}>
                      <MenuLink
                        size={'text-sm1 lg:text-lg'}
                        heading={item.title}
                        href={item.link}
                      />
                    </li>
                  ))}
              </ul>
            </div>
            <div>
              <ul className={'block text-right'} aria-label={'Дополнительная навигация'}>
                {nav.rightNav?.length &&
                  nav.rightNav.map((item: INavItem) => (
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
