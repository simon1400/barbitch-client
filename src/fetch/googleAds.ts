import axios from 'axios'

import { hasConsentCookie } from './pixel'

function getCookie(name: string): string | undefined {
  if (typeof document === 'undefined') return undefined
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`))
  return match ? decodeURIComponent(match[1]) : undefined
}

function generateTransactionId(): string {
  return `${Date.now()}-${crypto.randomUUID().slice(0, 8)}`
}

interface UserData {
  email?: string
  phone?: string
}

interface CustomData {
  currency?: string
  value?: string | number
}

/**
 * Send a server-side conversion to Google Ads via the Data Manager API
 * (the going-forward replacement for the deprecated uploadClickConversions).
 * Mirrors sendCAPIEvent: gated on cookie consent, swallows errors so it never
 * breaks the user flow. The matching gclid/gbraid/wbraid (if any) are read from
 * the first-party cookies set by <GoogleAdsClickId /> on the landing page.
 */
export const sendGoogleAdsConversion = async (
  eventName: 'Lead' | 'Purchase',
  userData?: UserData,
  customData?: CustomData,
) => {
  if (!hasConsentCookie()) return

  const transactionId = generateTransactionId()

  try {
    await axios.post('/api/google-ads-conversion', {
      event_name: eventName,
      transaction_id: transactionId,
      user_data: userData,
      custom_data: customData,
      gclid: getCookie('gclid'),
      gbraid: getCookie('gbraid'),
      wbraid: getCookie('wbraid'),
    })
  } catch (error) {
    // Don't break user flow if the conversion upload fails.
    console.error('Google Ads conversion failed:', error)
  }
}
