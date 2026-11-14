/* eslint-disable react-dom/no-missing-button-type */
'use client'

import { CONSENT_REQUEST_EVENT } from 'lib/chatEvents'
import { useEffect, useState } from 'react'

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void
  }
}

// Inline skript v <head> (app/layout.tsx) gtag definuje, ale na stránce 404 se
// nespustí — volání window.gtag pak shodilo celý web na „Něco se pokazilo“
// u každého, kdo dřív cookies přijal. Stejná definice jako od Googlu:
// do dataLayer musí jít objekt `arguments`, pole by GTM nepřečetl.
function ensureGtag() {
  const dataLayer = (window.dataLayer = window.dataLayer || [])
  if (typeof window.gtag === 'function') return
  window.gtag = function gtag() {
    // eslint-disable-next-line prefer-rest-params
    dataLayer.push(arguments)
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
  ensureGtag()
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
    // „Napiš nám do chatu“ bez souhlasu (s286) — lištu ukázat znovu
    const onRequest = () => {
      if (getConsentCookie() !== 'accepted') setVisible(true)
    }
    window.addEventListener(CONSENT_REQUEST_EVENT, onRequest)
    return () => window.removeEventListener(CONSENT_REQUEST_EVENT, onRequest)
  }, [])

  const handleAccept = () => {
    setConsentCookie('accepted')
    grantConsent()
    setVisible(false)
    window.dispatchEvent(new Event('cookie-consent-changed'))
  }

  const handleReject = () => {
    setConsentCookie('rejected')
    setVisible(false)
    window.dispatchEvent(new Event('cookie-consent-changed'))
  }

  if (!visible) return null

  // Varianta A (s286, rozhodnutí majitele 13.11): úzký černý pruh u spodního okraje.
  // Na telefonu nezakryje H1, slogan ani tlačítko rezervace — jen spodní řádek
  // pruhu faktů. Obě tlačítka stejně velká a stejně výrazná, zóna dotyku ≥ 44 px.
  const btn =
    'h-11 min-w-[96px] px-3 lg:px-5 text-[13px] lg:text-[14px] font-extrabold uppercase whitespace-nowrap [transition-property:color,background-color] [transition-duration:200ms] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white'

  return (
    <div
      role={'region'}
      aria-label={'Souhlas s cookies'}
      className={
        'fixed inset-x-0 bottom-0 z-[9999] bg-accent text-white border-t border-white/15 animate-in slide-in-from-bottom duration-300'
      }
    >
      <div
        className={
          'mx-auto max-w-[1440px] flex items-center gap-3 px-4 py-3 lg:px-[72px] lg:py-4 lg:gap-8'
        }
      >
        <p className={'m-0 flex-1 min-w-0 text-[12px] leading-[1.4] lg:text-[14px] font-medium'}>
          <span className={'lg:hidden'}>{'Cookies pro měření návštěvnosti.'}</span>
          <span className={'hidden lg:inline'}>
            {'Tento web používá soubory cookie pro analýzu návštěvnosti a zlepšení našich služeb.'}
          </span>{' '}
          <a
            href={'/cookies-policy'}
            className={'text-white underline underline-offset-2 hover:text-[#ff9dbb]'}
          >
            {'Více'}
          </a>
        </p>
        <div className={'flex shrink-0 gap-2 lg:gap-3'}>
          <button
            onClick={handleReject}
            className={`${btn} border-2 border-solid border-white bg-transparent text-white hover:bg-white hover:text-accent`}
          >
            {'Odmítnout'}
          </button>
          <button
            onClick={handleAccept}
            className={`${btn} border-2 border-solid border-white bg-white text-accent hover:bg-transparent hover:text-white`}
          >
            {'Souhlasím'}
          </button>
        </div>
      </div>
    </div>
  )
}
