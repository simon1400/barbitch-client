import type { IDataLinkToReserve } from 'fetch/contact'
import type { IDataNav } from 'fetch/nav'

import { getLinkToReserve } from 'fetch/contact'
import { getNav } from 'fetch/nav'

import { Container } from '../Container'

import Buttons from './Buttons'
import LogoWrap from './LogoWrap'
import Menu from './Menu'

export const Header = async () => {
  const dataLinkReserve: IDataLinkToReserve = await getLinkToReserve()
  const dataNav: IDataNav = await getNav()

  return (
    <>
      <header className={'absolute w-full z-50'}>
        <Container size={'xl'}>
          <div className={'flex justify-between py-3 lg:py-8 items-center'}>
            <LogoWrap />
            <Buttons linkToReserve={dataLinkReserve.linkToReserve} />
          </div>
        </Container>
      </header>

      <Menu nav={dataNav} />
      <noscript>
        <nav>
          <ul>
            {dataNav.leftNav.map((item) => (
              <li key={item.title}>
                <a href={item.link}>{item.title}</a>
              </li>
            ))}
            {dataNav.rightNav.map((item) => (
              <li key={item.title}>
                <a href={item.link}>{item.title}</a>
              </li>
            ))}
          </ul>
        </nav>
      </noscript>
    </>
  )
}
