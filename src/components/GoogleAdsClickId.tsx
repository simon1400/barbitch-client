'use client'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

// Google Ads click identifiers. Captured from the landing URL and persisted in
// first-party cookies so they're available later at conversion time (the booking /
// voucher confirmation), where the URL no longer carries them. This is the Google
// equivalent of the Meta `_fbc` cookie.
const CLICK_ID_KEYS = ['gclid', 'gbraid', 'wbraid'] as const
const MAX_AGE_SECONDS = 60 * 60 * 24 * 90 // 90 days — Google Ads click lookback window

function setClickIdCookie(name: string, value: string) {
  const secure = location.protocol === 'https:' ? '; Secure' : ''
  document.cookie = `${name}=${encodeURIComponent(value)}; max-age=${MAX_AGE_SECONDS}; path=/; SameSite=Lax${secure}`
}

const GoogleAdsClickId = () => {
  const pathname = usePathname()

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    for (const key of CLICK_ID_KEYS) {
      const value = params.get(key)
      if (value) setClickIdCookie(key, value)
    }
  }, [pathname])

  return null
}

export default GoogleAdsClickId
