'use client'

import type { ReactNode } from 'react'

import { MapEmbed } from 'components/MapEmbed'
import { usePathname } from 'next/navigation'

/**
 * Části patičky, které na /kontakt nepatří: stránka má vlastní H1 „Kontakt“
 * a vlastní mapu — v patičce by byly podruhé.
 */
export function NotOnKontakt({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  if (pathname === '/kontakt') return null
  return <>{children}</>
}

export function FooterMap({ mapLink }: { mapLink?: string }) {
  const pathname = usePathname()
  if (pathname === '/kontakt') return null
  return <MapEmbed mapLink={mapLink} variant={'footer'} />
}
