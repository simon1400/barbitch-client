'use client'
import type { ReactNode } from 'react'

import { usePathname } from 'next/navigation'

import { isHalloweenHome } from './darkPage'

// Obal <header>. Na hlavní stránce s Halloween herem sedí hlavička pod
// výstražnou páskou (10 px mobil / 14 px desktop).
const HeaderFrame = ({ halloween, children }: { halloween: boolean; children: ReactNode }) => {
  const pathname = usePathname()
  const offset = isHalloweenHome(pathname, halloween) ? 'top-2.5 lg:top-[14px]' : ''
  return <header className={`absolute w-full z-50 ${offset}`}>{children}</header>
}

export default HeaderFrame
