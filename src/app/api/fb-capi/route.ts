import type { NextRequest } from 'next/server'

import crypto from 'node:crypto'
// eslint-disable-next-line import/order
import { NextResponse } from 'next/server'

const PIXEL_ID = process.env.PIXEL_ID
const ACCESS_TOKEN = process.env.PIXEL_ACCESS_TOKEN
const TEST_EVENT_CODE = process.env.FB_TEST_EVENT_CODE

function hashSHA256(value: string): string {
  return crypto.createHash('sha256').update(value.trim().toLowerCase()).digest('hex')
}

interface CAPIRequestBody {
  event_name: string
  event_source_url: string
  event_id: string
  user_data?: {
    email?: string
    phone?: string
  }
  custom_data?: Record<string, unknown>
  fbp?: string
  fbc?: string
  external_id?: string
}

export async function POST(req: NextRequest) {
  try {
    const body: CAPIRequestBody = await req.json()
    const {
      event_name,
      event_source_url,
      event_id,
      user_data,
      custom_data,
      fbp,
      fbc,
      external_id,
    } = body

    if (!event_name || !event_id) {
      return NextResponse.json({ error: 'event_name and event_id are required' }, { status: 400 })
    }

    // Build user_data for Meta
    const metaUserData: Record<string, string> = {}

    // Hashed fields
    if (user_data?.email) {
      metaUserData.em = hashSHA256(user_data.email)
    }
    if (user_data?.phone) {
      const cleanPhone = user_data.phone.replace(/[\s\-()]/g, '')
      metaUserData.ph = hashSHA256(cleanPhone)
    }
    if (external_id) {
      metaUserData.external_id = hashSHA256(external_id)
    }

    // Non-hashed fields
    if (fbp) metaUserData.fbp = fbp
    if (fbc) metaUserData.fbc = fbc

    // Get IP and User-Agent from request headers
    const clientIp =
      req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || req.headers.get('x-real-ip')
    const userAgent = req.headers.get('user-agent')

    if (clientIp) metaUserData.client_ip_address = clientIp
    if (userAgent) metaUserData.client_user_agent = userAgent

    const eventData = {
      event_name,
      event_time: Math.floor(Date.now() / 1000),
      event_id,
      event_source_url: event_source_url || 'https://barbitch.cz',
      action_source: 'website',
      user_data: metaUserData,
      ...(custom_data && { custom_data }),
    }

    const payload: Record<string, unknown> = { data: [eventData] }
    if (TEST_EVENT_CODE) {
      payload.test_event_code = TEST_EVENT_CODE
    }

    const response = await fetch(
      `https://graph.facebook.com/v22.0/${PIXEL_ID}/events?access_token=${ACCESS_TOKEN}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      },
    )

    const result = await response.json()

    if (!response.ok) {
      console.error('FB CAPI error:', result)
      return NextResponse.json({ error: result }, { status: response.status })
    }

    return NextResponse.json({ success: true, result })
  } catch (error) {
    console.error('FB CAPI route error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
