'use client'

import { usePathname } from 'next/navigation'

export function HideOnRoutes({
  children,
  routes,
}: {
  children: React.ReactNode
  routes: string[]
}) {
  const pathname = usePathname()
  if (routes.some((r) => pathname.includes(r))) return null
  return <>{children}</>
}
