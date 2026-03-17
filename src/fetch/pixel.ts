import axios from 'axios'

declare global {
  interface Window {
    dataLayer?: Record<string, any>[]
  }
}

function generateEventId(): string {
  return `${Date.now()}-${crypto.randomUUID().slice(0, 8)}`
}

function getCookie(name: string): string | undefined {
  if (typeof document === 'undefined') return undefined
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`))
  return match ? decodeURIComponent(match[1]) : undefined
}

function getOrCreateExternalId(): string {
  if (typeof localStorage === 'undefined') return ''
  let id = localStorage.getItem('fb_external_id')
  if (!id) {
    id = `ext_${Date.now()}_${crypto.randomUUID().slice(0, 8)}`
    localStorage.setItem('fb_external_id', id)
  }
  return id
}

interface UserData {
  email?: string
  phone?: string
}

interface CustomData {
  currency?: string
  value?: string | number
  [key: string]: unknown
}

export function hasConsentCookie(): boolean {
  if (typeof document === 'undefined') return false
  return document.cookie.includes('cookie_consent=accepted')
}

/**
 * Send a server-side event via FB Conversions API + push to dataLayer for GTM deduplication.
 * Respects cookie consent — events are only sent if the user accepted cookies.
 */
export const sendCAPIEvent = async (
  eventName: string,
  userData?: UserData,
  customData?: CustomData,
) => {
  if (!hasConsentCookie()) return

  const eventId = generateEventId()

  // Push to dataLayer for GTM deduplication (client-side pixel uses same event_id)
  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push({
      event: `fb_${eventName.toLowerCase()}`,
      fb_event_id: eventId,
    })
  }

  // Collect browser-side identifiers for better Event Match Quality
  const fbp = getCookie('_fbp')
  const fbc = getCookie('_fbc')
  const externalId = getOrCreateExternalId()

  // Send server-side event via our API route
  try {
    await axios.post('/api/fb-capi', {
      event_name: eventName,
      event_id: eventId,
      event_source_url:
        typeof window !== 'undefined' ? window.location.href : 'https://barbitch.cz',
      user_data: userData,
      custom_data: customData,
      fbp,
      fbc,
      external_id: externalId,
    })
  } catch (error) {
    // Don't break user flow if CAPI fails
    console.error('FB CAPI event failed:', error)
  }
}
