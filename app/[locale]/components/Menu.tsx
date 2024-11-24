'use client'

import type { IDataNav, INavItem } from 'fetch/nav'

import Link from 'next/link'

import Button from './Button'
import Lang from './Lang'

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
                          className={'text-white text-sm1 lg:text-lg uppercase'}
                          href={item.link}
                        >
                          {item.title}
                        </Link>
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
                      <li className={'mt-0.5 lg:mt-2.5'} key={`rightMenu_${item.title}`}>
                        <Link
                          className={'text-white text-sm lg:text-md uppercase'}
                          href={item.link}
                        >
                          {item.title}
                        </Link>
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
