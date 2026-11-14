'use client'
import type { ReactNode } from 'react'

import { Container } from 'components/Container'
import { usePathname } from 'next/navigation'

import { isRedesignHome } from './darkPage'

/**
 * Obal obsahu hlavičky. Na nové hlavní stránce (s286) sedí hlavička ve stejné
 * mřížce jako sekce (1440 px, okraje 24 / 72 px, výška jako v návrhu), jinde
 * zůstává původní `Container xl` — ostatní stránky mají zatím starou mřížku.
 */
const HeaderContainer = ({ halloween, children }: { halloween: boolean; children: ReactNode }) => {
  const pathname = usePathname()
  if (isRedesignHome(pathname, halloween)) {
    return (
      <div className={'mx-auto w-full max-w-[1440px] px-6 lg:px-[72px]'}>
        <div className={'flex justify-between py-3.5 lg:py-7 items-center'}>{children}</div>
      </div>
    )
  }
  return (
    <Container size={'xl'}>
      <div className={'flex justify-between py-3 lg:py-8 items-center'}>{children}</div>
    </Container>
  )
}

export default HeaderContainer
