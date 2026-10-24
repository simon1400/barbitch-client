import type { IDataLinkToReserve } from 'fetch/contact'
import type { IDataNav } from 'fetch/nav'

import { getLinkToReserve } from 'fetch/contact'
import { getNav } from 'fetch/nav'
import { isHalloweenOn } from 'lib/halloween'

import { Container } from '../Container'

import Buttons from './Buttons'
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
        <Container size={'xl'}>
          <div className={'flex justify-between py-3 lg:py-8 items-center'}>
            <LogoWrap halloween={halloween} />
            <Buttons linkToReserve={dataLinkReserve.linkToReserve} halloween={halloween} />
          </div>
        </Container>
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
