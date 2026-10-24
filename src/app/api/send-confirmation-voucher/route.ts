/* eslint-disable import/order */

import type { NextRequest } from 'next/server'

import { Buffer } from 'node:buffer'
import crypto from 'node:crypto'
import { clientIp, makeRateLimiter } from 'lib/route-guard'
import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { confirmationHtml } from './confirmationHtml'

const resend = new Resend(process.env.RESEND_API_KEY)

const limit = makeRateLimiter(10, 60_000)

// Роут ТОЛЬКО server-to-server: его дёргает Strapi (api::campaign) после
// проверки JWT владельца. Из браузера сюда больше никто не ходит — CORS снят.
//
// 🟥 Почему появился секрет (s182): раньше роут был открыт в интернет и слал
// письмо от info@barbitch.cz на произвольный адрес с произвольным содержимым
// полей — достаточно было знать URL (админка ходила сюда без авторизации).
// Тот же секрет и та же схема, что у send-bulk-email (s175): нет секрета в
// окружении → 503, режим fail-closed.
const timingSafeEqual = (a: string, b: string): boolean => {
  const bufA = Buffer.from(a)
  const bufB = Buffer.from(b)
  if (bufA.length !== bufB.length) return false
  return crypto.timingSafeEqual(bufA, bufB)
}

const escapeHtml = (value: unknown) =>
  String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')

export async function POST(req: NextRequest) {
  try {
    const secret = process.env.CAMPAIGN_SEND_SECRET
    if (!secret) {
      return NextResponse.json({ error: 'Voucher confirmation is not configured' }, { status: 503 })
    }
    const provided = req.headers.get('x-campaign-secret') || ''
    if (!timingSafeEqual(provided, secret)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
    if (!limit(clientIp(req))) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
    }

    const { email, buyerName, recipientName, voucherId, validUntil, serviceName } = await req.json()

    // Validate required fields
    if (!email || !buyerName || !recipientName || !voucherId || !validUntil) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
    }

    const safeBuyer = escapeHtml(buyerName)
    const safeRecipient = escapeHtml(recipientName)
    const safeVoucherId = escapeHtml(voucherId)
    const safeValidUntil = escapeHtml(validUntil)
    // s274: voucher na konkrétní službu (nepovinné — starší vouchery ho nemají)
    const service = typeof serviceName === 'string' ? serviceName.slice(0, 200) : null

    const htmlTemplate = confirmationHtml({
      safeBuyer,
      safeRecipient,
      safeVoucherId,
      safeValidUntil,
      service,
    })

    const { data, error } = await resend.emails.send({
      from: 'Bar.Bitch <info@barbitch.cz>',
      to: [email],
      subject: 'Váš voucher je aktivní - Bar.Bitch',
      html: htmlTemplate,
    })

    if (error) {
      console.error('Error sending email:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, data }, { status: 200 })
  } catch (error) {
    console.error('Error in send-confirmation-voucher API:', error)
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
  }
}
