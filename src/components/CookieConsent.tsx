/* eslint-disable react-dom/no-missing-button-type */
'use client'

import { useEffect, useState } from 'react'

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void
  }
}

function getConsentCookie(): string | null {
  if (typeof document === 'undefined') return null
  const match = document.cookie.match(/(?:^|; )cookie_consent=([^;]*)/)
  return match ? match[1] : null
}

function setConsentCookie(value: 'accepted' | 'rejected') {
  const maxAge = 365 * 24 * 60 * 60
  document.cookie = `cookie_consent=${value}; path=/; max-age=${maxAge}; SameSite=Lax`
}

function grantConsent() {
  window.gtag('consent', 'update', {
    analytics_storage: 'granted',
    ad_storage: 'granted',
    ad_user_data: 'granted',
    ad_personalization: 'granted',
    functionality_storage: 'granted',
    personalization_storage: 'granted',
  })
}

export default function CookieConsent() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const consent = getConsentCookie()
    if (consent === 'accepted') {
      grantConsent()
    } else if (!consent) {
      setVisible(true)
    }
  }, [])

  const handleAccept = () => {
    setConsentCookie('accepted')
    grantConsent()
    setVisible(false)
  }

  const handleReject = () => {
    setConsentCookie('rejected')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div
      className={'fixed bottom-0 left-0 z-[9999] p-4 animate-in slide-in-from-bottom duration-300'}
    >
      <div
        className={'max-w-lg mx-auto bg-accent text-white p-6 shadow-2xl border border-white/10'}
      >
        <h3 className={'text-sm11 font-bold mb-2'}>{'Záleží nám na vašem soukromí'}</h3>
        <p className={'text-sm text-gray-300 mb-5 font-normal leading-relaxed'}>
          {'Tento web používá soubory cookie pro analýzu návštěvnosti a zlepšení'}
          {'našich služeb.'}{' '}
          <a
            href={'/cookies-policy'}
            className={'text-primary underline hover:text-primary/80 transition-colors'}
          >
            {'Více informací'}
          </a>
        </p>
        <div className={'flex gap-3'}>
          <button
            onClick={handleReject}
            className={
              'flex-1 py-3 px-4 border border-white/30 text-sm font-medium hover:bg-white/10 transition-colors'
            }
          >
            {'Odmítnout'}
          </button>
          <button
            onClick={handleAccept}
            className={
              'flex-1 py-3 px-4 bg-primary text-sm font-bold hover:bg-primary/90 transition-colors'
            }
          >
            {'Souhlasím'}
          </button>
        </div>
      </div>
    </div>
  )
}
