import type { NextRequest } from 'next/server'

import crypto from 'node:crypto'
// eslint-disable-next-line import/order
import { NextResponse } from 'next/server'

// --- Google Ads server-side conversions via the Data Manager API ---
// Going-forward replacement for the deprecated Google Ads API uploadClickConversions
// (sunset for new integrations on 2026-06-15). Reference:
//   https://developers.google.com/data-manager/api/reference/rest/v1/events/ingest
//
// Self-serve setup (no developer token / no MCC approval — that was the old API):
//   - OAuth client + refresh token from your own Google Cloud project, scope:
//     https://www.googleapis.com/auth/datamanager
//   - GOOGLE_DM_OPERATING_ACCOUNT_ID = your Google Ads account id (digits, no dashes)
//   - GOOGLE_DM_LOGIN_ACCOUNT_ID     = account your credential can access (MCC if via manager,
//                                      else same as operating). Optional — defaults to operating.
//   - GOOGLE_DM_CONVERSION_ACTION_*  = conversion action ids (type WEBPAGE) from Google Ads UI
//
// NOTE: this targets the v1 schema. Before sending live data, set GOOGLE_DM_VALIDATE_ONLY=true
// to dry-run against the API and confirm field names/enums for your account.
const CLIENT_ID = process.env.GOOGLE_DM_CLIENT_ID
const CLIENT_SECRET = process.env.GOOGLE_DM_CLIENT_SECRET
const REFRESH_TOKEN = process.env.GOOGLE_DM_REFRESH_TOKEN
const OPERATING_ACCOUNT_ID = process.env.GOOGLE_DM_OPERATING_ACCOUNT_ID
const LOGIN_ACCOUNT_ID = process.env.GOOGLE_DM_LOGIN_ACCOUNT_ID || OPERATING_ACCOUNT_ID
const ACTION_LEAD = process.env.GOOGLE_DM_CONVERSION_ACTION_LEAD
const ACTION_PURCHASE = process.env.GOOGLE_DM_CONVERSION_ACTION_PURCHASE
const VALIDATE_ONLY = process.env.GOOGLE_DM_VALIDATE_ONLY === 'true'

const TOKEN_ENDPOINT = 'https://oauth2.googleapis.com/token'
const INGEST_ENDPOINT = 'https://datamanager.googleapis.com/v1/events:ingest'

function hashHex(value: string): string {
  return crypto.createHash('sha256').update(value).digest('hex')
}

// Email: lowercase + trim (Google normalizes the rest).
function normalizeEmail(email: string): string {
  return email.trim().toLowerCase()
}

// Phone: E.164. Strip formatting; default to Czech +420 when no country code present.
function normalizePhone(phone: string): string {
  let p = phone.replace(/[\s\-()]/g, '')
  if (!p.startsWith('+')) {
    p = `+420${p.replace(/^0+/, '')}`
  }
  return p
}

interface ConversionRequestBody {
  event_name: 'Lead' | 'Purchase'
  transaction_id?: string
  user_data?: { email?: string; phone?: string }
  custom_data?: { currency?: string; value?: string | number }
  gclid?: string
  gbraid?: string
  wbraid?: string
}

async function getAccessToken(): Promise<string> {
  const res = await fetch(TOKEN_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: CLIENT_ID as string,
      client_secret: CLIENT_SECRET as string,
      refresh_token: REFRESH_TOKEN as string,
      grant_type: 'refresh_token',
    }),
  })
  const json = await res.json()
  if (!res.ok) {
    throw new Error(`OAuth token error: ${JSON.stringify(json)}`)
  }
  return json.access_token as string
}

export async function POST(req: NextRequest) {
  try {
    const body: ConversionRequestBody = await req.json()
    const { event_name, transaction_id, user_data, custom_data, gclid, gbraid, wbraid } = body

    const conversionActionId = event_name === 'Purchase' ? ACTION_PURCHASE : ACTION_LEAD

    // Safely no-op until configured (same resilience as the FB CAPI route without PIXEL_ID).
    if (
      !CLIENT_ID ||
      !CLIENT_SECRET ||
      !REFRESH_TOKEN ||
      !OPERATING_ACCOUNT_ID ||
      !conversionActionId
    ) {
      return NextResponse.json({ skipped: 'google-ads-conversion not configured' })
    }

    // Hashed user identifiers. IP is intentionally never sent (prohibited for EEA users).
    const userIdentifiers: Record<string, string>[] = []
    if (user_data?.email) {
      userIdentifiers.push({ emailAddress: hashHex(normalizeEmail(user_data.email)) })
    }
    if (user_data?.phone) {
      userIdentifiers.push({ phoneNumber: hashHex(normalizePhone(user_data.phone)) })
    }

    const adIdentifiers: Record<string, string> = {}
    if (gclid) adIdentifiers.gclid = gclid
    if (gbraid) adIdentifiers.gbraid = gbraid
    if (wbraid) adIdentifiers.wbraid = wbraid

    const event: Record<string, unknown> = {
      destinationReferences: ['google-ads'],
      eventTimestamp: new Date().toISOString(),
      consent: { adUserData: 'CONSENT_GRANTED', adPersonalization: 'CONSENT_GRANTED' },
      ...(transaction_id && { transactionId: transaction_id }),
      ...(userIdentifiers.length > 0 && { userData: { userIdentifiers } }),
      ...(Object.keys(adIdentifiers).length > 0 && { adIdentifiers }),
    }

    // Monetary value only for purchases (bookings carry no value here).
    if (custom_data?.value !== undefined) {
      event.conversionValue = Number(custom_data.value)
      event.currency = custom_data.currency || 'CZK'
    }

    const payload = {
      destinations: [
        {
          reference: 'google-ads',
          loginAccount: { accountType: 'GOOGLE_ADS', accountId: LOGIN_ACCOUNT_ID },
          operatingAccount: { accountType: 'GOOGLE_ADS', accountId: OPERATING_ACCOUNT_ID },
          productDestinationId: conversionActionId,
        },
      ],
      events: [event],
      encoding: 'HEX',
      validateOnly: VALIDATE_ONLY,
    }

    const accessToken = await getAccessToken()

    const response = await fetch(INGEST_ENDPOINT, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    const result = await response.json()

    if (!response.ok) {
      console.error('Data Manager API error:', result)
      return NextResponse.json({ error: result }, { status: response.status })
    }

    return NextResponse.json({ success: true, result })
  } catch (error) {
    console.error('Google Ads conversion route error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
