'use client'

import { sendCAPIEvent } from 'fetch/pixel'
import { usePathname } from 'next/navigation'
import { useEffect, useRef } from 'react'

export default function FacebookPageView() {
  const pathname = usePathname()
  const lastPathRef = useRef<string>('')

  useEffect(() => {
    if (pathname === lastPathRef.current) return
    lastPathRef.current = pathname
    sendCAPIEvent('PageView')
  }, [pathname])

  return null
}
