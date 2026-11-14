import type { IDataLinkToReserve } from 'fetch/contact'
import type { IDataNav } from 'fetch/nav'

import { getLinkToReserve } from 'fetch/contact'
import { getNav } from 'fetch/nav'
import { isHalloweenOn } from 'lib/halloween'

import Buttons from './Buttons'
import HeaderContainer from './HeaderContainer'
import HeaderFrame from './HeaderFrame'
import LogoWrap from './LogoWrap'
import Menu from './Menu'

export const Header = async () => {
  const [dataLinkReserve, dataNav]: [IDataLinkToReserve, IDataNav] = await Promise.all([
    getLinkToReserve(),
    getNav(),
  ])
  const halloween = isHalloweenOn()

  return (
    <>
      <HeaderFrame halloween={halloween}>
        <HeaderContainer halloween={halloween}>
          <LogoWrap halloween={halloween} />
          <Buttons linkToReserve={dataLinkReserve.linkToReserve} halloween={halloween} />
        </HeaderContainer>
      </HeaderFrame>

      <Menu nav={dataNav} halloween={halloween} />
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
