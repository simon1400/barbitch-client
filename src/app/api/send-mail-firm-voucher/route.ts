import type { NextRequest } from 'next/server'

import { parseFormAttachment } from 'lib/formAttachment'
import { clientIp, makeRateLimiter, sameOrigin } from 'lib/route-guard'
import { resolveSalonEmail } from 'lib/salonEmail'
import { FIRM_LOGO_ACCEPT_TYPES, FIRM_LOGO_MAX_BYTES, FIRM_MIN_COUNT } from 'lib/vouchers'
import { NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY!)

const limit = makeRateLimiter(5, 60_000)

const LOGO_TYPES: ReadonlySet<string> = new Set(FIRM_LOGO_ACCEPT_TYPES)

const EMAIL_RE = /^[^\s@]+@[^\s@][^\s.@]*\.[^\s@]+$/

const escapeHtml = (value: string) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')

const clip = (value: unknown, max: number) =>
  String(value ?? '')
    .trim()
    .slice(0, max)

const FIELDS: [key: string, label: string][] = [
  ['company', 'Firma'],
  ['ico', 'IČO'],
  ['count', 'Počet voucherů'],
  ['value', 'Hodnota / služba'],
  ['person', 'Kontaktní osoba'],
  ['phone', 'Telefon'],
  ['email', 'E-mail'],
  ['note', 'Poznámka'],
]

const rowsHtml = (data: Record<string, string>) =>
  FIELDS.filter(([key]) => data[key])
    .map(
      ([key, label]) =>
        `<p style="margin:0 0 8px;"><strong>${label}:</strong> <span style="white-space:pre-wrap;">${escapeHtml(data[key])}</span></p>`,
    )
    .join('')

const wrap = (inner: string) => `
  <div style="font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:24px;color:#161615;">
    ${inner}
  </div>`

// Firemní poptávka voucherů: oznámení salonu (odpověď jde rovnou firmě)
// (s logem v příloze) a potvrzení firmě, že poptávka dorazila. Data se nikam neukládají.
export async function POST(req: NextRequest) {
  try {
    if (!sameOrigin(req)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
    if (!limit(clientIp(req))) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
    }

    const form = await req.formData()
    const field = (key: string, max: number) => clip(form.get(key), max)
    const data: Record<string, string> = {
      company: field('company', 200),
      ico: field('ico', 20),
      count: field('count', 10),
      value: field('value', 200),
      person: field('person', 200),
      phone: field('phone', 60),
      email: field('email', 200),
      note: field('note', 4000),
    }

    const count = Number(data.count)
    if (
      !data.company ||
      !data.person ||
      !EMAIL_RE.test(data.email) ||
      !Number.isInteger(count) ||
      count < FIRM_MIN_COUNT ||
      form.get('consent') !== 'true'
    ) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const parsed = await parseFormAttachment(form.get('logo'), {
      maxBytes: FIRM_LOGO_MAX_BYTES,
      allowedTypes: LOGO_TYPES,
      fallbackName: 'logo',
      label: 'Logo',
    })
    if (!parsed.ok) {
      return NextResponse.json({ error: parsed.error }, { status: parsed.status })
    }
    const logo = parsed.attachment

    const recipient = await resolveSalonEmail('FIRM_VOUCHER_NOTIFY_EMAIL')
    if (!recipient) {
      console.error('send-mail-firm-voucher: no recipient e-mail configured')
      return NextResponse.json({ error: 'No recipient configured' }, { status: 500 })
    }

    const from = `Bar.Bitch Brno <${process.env.RESEND_FROM_EMAIL!}>`
    const { error } = await resend.emails.send({
      from,
      to: [recipient],
      replyTo: data.email,
      subject: `Firemní vouchery: ${data.company} (${count} ks)`,
      html: wrap(`
        <h2 style="margin:0 0 16px;font-size:20px;">Nová poptávka firemních voucherů</h2>
        ${rowsHtml(data)}
        <p style="margin:16px 0 0;"><strong>Logo:</strong> ${logo ? `${escapeHtml(logo.filename)} (v příloze)` : 'nepřiloženo'}</p>
        <hr style="border:none;border-top:1px solid #e5e5e5;margin:20px 0;" />
        <p style="margin:0;color:#888;font-size:13px;">Odesláno z formuláře na barbitch.cz/firemni-vouchery. Odpovědí na tento e-mail napíšete přímo firmě.</p>
      `),
      ...(logo ? { attachments: [logo] } : {}),
    })

    if (error) {
      console.error('send-mail-firm-voucher Resend error:', error)
      return NextResponse.json({ error: 'Failed to send' }, { status: 500 })
    }

    // Potvrzení firmě — když selže, poptávka už u salonu je, chybu jen zalogujeme.
    const { error: confirmError } = await resend.emails.send({
      from,
      to: [data.email],
      replyTo: recipient,
      subject: 'Děkujeme za poptávku firemních voucherů',
      html: wrap(`
        <h2 style="margin:0 0 16px;font-size:20px;">Děkujeme, ${escapeHtml(data.person)}!</h2>
        <p style="margin:0 0 16px;">Vaši poptávku jsme přijali. Do jednoho pracovního dne vám pošleme kalkulaci a náhled voucheru.</p>
        ${rowsHtml(data)}
        <hr style="border:none;border-top:1px solid #e5e5e5;margin:20px 0;" />
        <p style="margin:0;color:#888;font-size:13px;">Bar.Bitch Brno, Křenová 294/16, 602 00 Brno</p>
      `),
    })
    if (confirmError) {
      console.error('send-mail-firm-voucher confirmation error:', confirmError)
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('send-mail-firm-voucher error:', error)
    return NextResponse.json({ error: 'Failed to send' }, { status: 500 })
  }
}
