'use client'

import { hasConsentCookie, sendCAPIEvent } from 'fetch/pixel'
import { usePathname } from 'next/navigation'
import { useEffect, useRef } from 'react'

export default function FacebookPageView() {
  const pathname = usePathname()
  const lastPathRef = useRef<string>('')
  const sentForPathRef = useRef<string>('')

  // Send PageView on route change
  useEffect(() => {
    if (pathname === lastPathRef.current) return
    lastPathRef.current = pathname
    if (hasConsentCookie()) {
      sendCAPIEvent('PageView')
      sentForPathRef.current = pathname
    }
  }, [pathname])

  // Send PageView when user accepts cookies (if not already sent for current page)
  useEffect(() => {
    const handler = () => {
      if (hasConsentCookie() && sentForPathRef.current !== lastPathRef.current) {
        sendCAPIEvent('PageView')
        sentForPathRef.current = lastPathRef.current
      }
    }
    window.addEventListener('cookie-consent-changed', handler)
    return () => window.removeEventListener('cookie-consent-changed', handler)
  }, [])

  return null
}
