/* eslint-disable import/order */

import type { NextRequest } from 'next/server'

import { Buffer } from 'node:buffer'
import crypto from 'node:crypto'
import { clientIp, makeRateLimiter } from 'lib/route-guard'
import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { buildVoucherPdf } from '../send-mail-voucher/voucherPdf'
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

interface Attachment {
  filename: string
  content: string
}

/** PDF voucheru: na částku = šablona public/vouchers/<sum>.pdf, na službu = název služby. */
const voucherAttachment = async (v: {
  service: string | null
  sum: unknown
  recipientName: unknown
  validUntil: unknown
  voucherId: unknown
}): Promise<Attachment> => {
  const pdf = await buildVoucherPdf({
    amount: v.service ? undefined : String(Number(v.sum)),
    serviceTitle: v.service ?? undefined,
    forName: String(v.recipientName).slice(0, 40),
    validUntil: String(v.validUntil),
    idVoucher: String(v.voucherId),
  })
  const stem = (v.service ? 'sluzba' : String(Number(v.sum))).replaceAll(/[^\w.-]/g, '')
  return {
    filename: `v_${stem}_${String(v.voucherId).replaceAll(/[^\w.-]/g, '')}.pdf`,
    content: Buffer.from(pdf).toString('base64'),
  }
}

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

    const { email, buyerName, recipientName, voucherId, validUntil, serviceName, attachPdf, sum } =
      await req.json()

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

    // s275: platba kartou (Strapi po potvrzení Comgate) — voucher rovnou v příloze.
    let attachments: Attachment[] | undefined
    if (attachPdf === true) {
      try {
        attachments = [
          await voucherAttachment({ service, sum, recipientName, validUntil, voucherId }),
        ]
      } catch (error) {
        console.error('Voucher PDF failed:', error)
        return NextResponse.json({ error: 'Voucher PDF failed' }, { status: 400 })
      }
    }

    const htmlTemplate = confirmationHtml({
      safeBuyer,
      safeRecipient,
      safeVoucherId,
      safeValidUntil,
      service,
      pdfAttached: Boolean(attachments),
    })

    const { data, error } = await resend.emails.send({
      from: 'Bar.Bitch <info@barbitch.cz>',
      to: [email],
      bcc: attachments && process.env.RESEND_BCC_EMAIL ? [process.env.RESEND_BCC_EMAIL] : undefined,
      subject: attachments
        ? 'Váš dárkový voucher - Bar.Bitch'
        : 'Váš voucher je aktivní - Bar.Bitch',
      html: htmlTemplate,
      attachments,
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
