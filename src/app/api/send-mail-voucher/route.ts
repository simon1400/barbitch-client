/* eslint-disable import/order */
/* eslint-disable perfectionist/sort-imports */
import type { NextRequest } from 'next/server'

import path from 'node:path'
import { addMonths, format } from 'date-fns'
import { NextResponse } from 'next/server'
import { Resend } from 'resend'

import { getVoucherCatalog } from 'fetch/voucherCatalog'
import { FOR_NAME_MAX, formatKc, FROM_NAME_MAX, VOUCHER_VALID_MONTHS } from 'lib/vouchers'
import { clientIp, makeRateLimiter, sameOrigin } from 'lib/route-guard'

import { htmlTemplate } from './htmlTemplate'
import { buildVoucherPdf } from './voucherPdf'
import { voucherRulesHtml } from './voucherRules'

const resend = new Resend(process.env.RESEND_API_KEY!)

const limit = makeRateLimiter(10, 60_000)
const escapeHtml = (value: unknown) =>
  String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')

const clip = (value: unknown, max: number) =>
  String(value ?? '')
    .trim()
    .slice(0, max)

interface ResolvedVoucher {
  /** Název šablony PDF (voucher na částku) — u služby se nepoužije. */
  amount?: string
  serviceTitle?: string
  /** Řádek „Voucher:“ v e-mailu. */
  label: string
  sum: number
}

/**
 * Co se má poslat. Objednávka ze stránky posílá `voucherId` z katalogu
 * (lib/vouchers) — cena a šablona se dohledají tady, ne z prohlížeče.
 * Bonusový voucher z kabinetu posílá starý tvar `{ voucher, sum }`.
 */
const resolveVoucher = async (body: Record<string, unknown>): Promise<ResolvedVoucher | null> => {
  if (typeof body.voucherId === 'string') {
    const catalog = await getVoucherCatalog()
    const item = catalog.find((i) => i.id === body.voucherId)
    if (!item) return null
    return item.kind === 'sluzba'
      ? {
          serviceTitle: item.name,
          label: `${item.name} (${formatKc(item.price)})`,
          sum: item.price,
        }
      : { amount: item.amount, label: formatKc(item.price), sum: item.price }
  }

  // Whitelist voucher template name — strip any path component (no traversal).
  const amount = path.basename(String(body.voucher ?? '')).replaceAll(/[^\w.-]/g, '')
  if (!amount) return null
  const sum = Number(body.sum)
  return { amount, label: formatKc(sum), sum }
}

export async function POST(req: NextRequest) {
  try {
    if (!sameOrigin(req)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
    if (!limit(clientIp(req))) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
    }

    const body = await req.json()
    const { email, idVoucher } = body
    // Comgate (další fáze): `paymentStatus` zatím vždy 'pending' — po napojení brány
    // poslat PDF až po potvrzení platby a z e-mailu vypustit platební údaje.

    if (!email) {
      return NextResponse.json({ error: 'Missing required field: email' }, { status: 400 })
    }

    const voucher = await resolveVoucher(body)
    if (!voucher) {
      return NextResponse.json({ error: 'Invalid voucher' }, { status: 400 })
    }

    // Nový tvar: forName/fromName; kabinet: recipientName/name. Na voucher se tiskne
    // jen jméno obdarované, „od koho“ je oslovení v e-mailu.
    const forName = clip(body.forName ?? body.recipientName, FOR_NAME_MAX)
    const buyerName = clip(body.fromName ?? body.name, FROM_NAME_MAX) || 'Zákazník'

    let pdfBytes: Uint8Array
    try {
      pdfBytes = await buildVoucherPdf({
        amount: voucher.amount,
        serviceTitle: voucher.serviceTitle,
        forName,
        validUntil: format(addMonths(new Date(), VOUCHER_VALID_MONTHS), 'dd.MM.yyyy'),
        idVoucher: String(idVoucher),
      })
    } catch {
      return NextResponse.json({ error: 'Invalid voucher' }, { status: 400 })
    }
    // eslint-disable-next-line ts/no-require-imports
    const pdfBase64 = require('node:buffer').Buffer.from(pdfBytes).toString('base64')

    // Zaplatit převodem — voucher je v příloze, aktivuje se po připsání platby.
    const personalizedHtml = htmlTemplate
      .replace(/\{\{ name \}\}/g, escapeHtml(buyerName))
      .replace(/\{\{ voucherLabel \}\}/g, escapeHtml(voucher.label))
      .replace(/\{\{ sum \}\}/g, String(voucher.sum))
      .replace(/\{\{ idVoucher \}\}/g, escapeHtml(idVoucher))
      .replace(
        /\{\{ rules \}\}/g,
        voucherRulesHtml(voucher.serviceTitle, 'Voucher je aktivní až po zaplacení.'),
      )

    const fileStem = (voucher.amount ?? 'sluzba').replaceAll(/[^\w.-]/g, '')
    const { data, error } = await resend.emails.send({
      from: `Bar.Bitch Brno <${process.env.RESEND_FROM_EMAIL!}>`,
      to: [email],
      bcc: process.env.RESEND_BCC_EMAIL ? [process.env.RESEND_BCC_EMAIL] : undefined,
      subject: `Děkujeme za objednávku, ${buyerName}!`,
      html: personalizedHtml,
      attachments: [
        {
          filename: `v_${fileStem}_${String(idVoucher).replaceAll(/[^\w.-]/g, '')}.pdf`,
          content: pdfBase64,
        },
      ],
    })

    if (error) {
      console.error('Resend error:', error)
      return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
    }

    return NextResponse.json({ message: 'Email sent successfully', data })
  } catch (error: any) {
    console.error('Resend error:', error)
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
  }
}
