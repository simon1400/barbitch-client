'use client'

import type { IDataNav } from 'fetch/nav'

import { Squash as Hamburger } from 'hamburger-react'
import { LogoIcon } from 'icons/Logo'
// import Lang from './Lang'
import Link from 'next/link'
import { useParams, usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

import Button from './Button'
import Menu from './Menu'

export const Header = ({ dataNav, linkReserve }: { dataNav: IDataNav; linkReserve: string }) => {
  const [menu, setMenu] = useState<boolean>(false)
  const pathname = usePathname()
  const params = useParams()

  useEffect(() => {
    const root = document.getElementsByTagName('html')[0]
    if (menu) {
      document.body.classList.add('overflow-y-hidden')
      root.classList.add('overflow-y-hidden')
    } else {
      document.body.classList.remove('overflow-y-hidden')
      root.classList.remove('overflow-y-hidden')
    }
  }, [menu])

  useEffect(() => {
    setMenu(false)
  }, [pathname])

  if (pathname === '/reservation') {
    return null
  }

  return (
    <>
      <header className={'absolute w-full z-50'} role={'banner'} aria-label={'Основное меню'}>
        <div className={'container mx-auto max-w-[1400px] px-4'}>
          <div className={'flex justify-between py-3 lg:py-8 items-center'}>
            <div>
              <Link
                href={'/'}
                className={'block max-w-[205px] lg:max-w-[290px]'}
                aria-label={'Перейти на главную страницу'}
              >
                <LogoIcon
                  className={`w-full ${menu ? 'fill-primary' : params?.post ? 'fill-white' : 'fill-accent'}`}
                />
              </Link>
            </div>

            {/* Навигация справа */}
            <div className={'flex gap-13 items-center'}>
              {/* Кнопка "Резервировать термин" */}
              <Button
                inverse={menu}
                className={'hidden lg:block'}
                text={'Rezervovat termín'}
                id={'book-button'}
                white={!!params?.post}
                small
                blank
                href={linkReserve}
              />

              {/* Языковое переключение
              <div className={'hidden lg:block'}>
                <Lang menu={menu} />
              </div> */}

              {/* Кнопка-гамбургер */}
              <Hamburger
                color={menu || params?.post ? '#fff' : '#161615'}
                onToggle={() => setMenu(!menu)}
                toggled={menu}
                size={48}
                duration={0.3}
                distance={'sm'}
                aria-label={'Открыть или закрыть меню'}
                aria-expanded={menu}
                aria-controls={'main-menu'}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Меню */}
      <Menu open={menu} nav={dataNav} />
    </>
  )
}
