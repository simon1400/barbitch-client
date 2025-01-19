'use client'

import type { IDataNav } from 'fetch/nav'

import { Squash as Hamburger } from 'hamburger-react'
import { LogoIcon } from 'icons/Logo'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useMediaQuery } from 'react-responsive'

import Button from './Button'
import Lang from './Lang'
import { Menu } from './Menu'

export const Header = ({ dataNav, linkReserve }: { dataNav: IDataNav; linkReserve: string }) => {
  const [menu, setMenu] = useState<boolean>(false)
  const pathname = usePathname()
  const isDesktopMedia = useMediaQuery({
    query: '(min-width: 1024px)',
  })

  const [isDesktop, setIsDesktop] = useState(false)
  useEffect(() => {
    setIsDesktop(isDesktopMedia)
  }, [isDesktopMedia])

  useEffect(() => {
    if (menu) {
      document.body.classList.add('overflow-y-hidden')
    } else {
      document.body.classList.remove('overflow-y-hidden')
    }
  }, [menu])

  useEffect(() => {
    setMenu(false)
  }, [pathname])

  return (
    <>
      <header className={'absolute w-full z-50'}>
        <div className={'container mx-auto max-w-[1400px] px-4'}>
          <div className={'flex justify-between py-3 lg:py-8 items-center'}>
            <div>
              <Link href={'/'} className={'block max-w-[205px] lg:max-w-[290px]'}>
                <LogoIcon className={`w-full ${menu ? 'fill-primary' : 'fill-accent'}`} />
              </Link>
            </div>
            <div className={'flex gap-13 items-center'}>
              <Button
                inverse={menu}
                className={'hidden lg:block'}
                text={'Rezervovat termin'}
                small
                blank
                href={linkReserve}
              />
              <div className={'hidden lg:block'}>
                <Lang menu={menu} />
              </div>
              <Hamburger
                color={menu ? '#fff' : '#161615'}
                onToggle={() => setMenu(!menu)}
                toggled={menu}
                size={isDesktop ? 48 : 38}
                duration={0.3}
                distance={'sm'}
              />
            </div>
          </div>
        </div>
      </header>
      <Menu open={menu} nav={dataNav} />
    </>
  )
}
