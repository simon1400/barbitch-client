'use client'

import { usePathname } from 'next/navigation'

const NONE: string[] = []

export function HideOnRoutes({
  children,
  routes,
  exact = NONE,
}: {
  children: React.ReactNode
  /** Skrýt, když adresa obsahuje některý z řetězců. */
  routes: string[]
  /** Skrýt jen na přesně těchto adresách (např. '/' — `routes` by chytil všechno). */
  exact?: string[]
}) {
  const pathname = usePathname()
  if (exact.includes(pathname) || routes.some((r) => pathname.includes(r))) return null
  return <>{children}</>
}
