import type { NextRequest } from 'next/server'

import { clientIp, makeRateLimiter } from 'lib/route-guard'
import { NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

const limit = makeRateLimiter(10, 60_000)

// Этот роут вызывает АДМИНКА (admin.barbitch.cz) cross-origin, как send-bulk-email.
// Поэтому sameOrigin тут не подходит — нужен CORS-allowlist по origin.
const ALLOWED_ORIGINS = new Set([
  'https://admin.barbitch.cz',
  'https://barbitch.cz',
  'https://www.barbitch.cz',
])

const corsHeaders = (req: NextRequest): Record<string, string> => {
  const origin = req.headers.get('origin') || ''
  const headers: Record<string, string> = {
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    Vary: 'Origin',
  }
  if (ALLOWED_ORIGINS.has(origin)) headers['Access-Control-Allow-Origin'] = origin
  return headers
}

const escapeHtml = (value: unknown) =>
  String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')

export async function OPTIONS(req: NextRequest) {
  return NextResponse.json({}, { headers: corsHeaders(req) })
}

export async function POST(req: NextRequest) {
  const cors = corsHeaders(req)
  try {
    const origin = req.headers.get('origin')
    if (origin && !ALLOWED_ORIGINS.has(origin)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403, headers: cors })
    }
    if (!limit(clientIp(req))) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429, headers: cors })
    }

    const { email, buyerName, recipientName, voucherId, validUntil } = await req.json()

    // Validate required fields
    if (!email || !buyerName || !recipientName || !voucherId || !validUntil) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400, headers: cors })
    }

    const safeBuyer = escapeHtml(buyerName)
    const safeRecipient = escapeHtml(recipientName)
    const safeVoucherId = escapeHtml(voucherId)
    const safeValidUntil = escapeHtml(validUntil)

    const htmlTemplate = `<!DOCTYPE html>
<html lang="cs">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <title>Váš voucher je aktivní</title>
    <style>
      @media (max-width:600px){
        .container{width:100%!important}
        .px{padding-left:16px!important;padding-right:16px!important}
      }
    </style>
  </head>
  <body style="margin:0;padding:0;background:#1f1f1f;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#e71e6e;">
      <tr>
        <td>
          <table role="presentation" align="center" width="600" class="container" cellspacing="0" cellpadding="0" border="0" style="margin:0 auto;background:#161615;color:#ffffff;width:600px;">

            <tr>
              <td style="padding:24px;text-align:center;background:#e71e6e;">
                <img src="https://barbitch.cz/assets/logo-email.svg" alt="Bar.Bitch" width="220" style="max-width:220px;height:auto;display:block;margin:0 auto;">
              </td>
            </tr>

            <tr>
              <td class="px" style="padding:24px 24px 0 24px;text-align:center;">
                <div style="font-family:Arial,Helvetica,sans-serif;font-size:28px;font-weight:700;line-height:1.3;color:#ffffff;margin:0;">
                  Gratulujeme, ${safeBuyer}! 🎉
                </div>
              </td>
            </tr>

            <tr>
              <td class="px" style="padding:16px 24px 24px 24px;text-align:center;">
                <div style="font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:22px;color:#e6e6e6;margin:0;">
                  Potvrzujeme, že váš voucher byl úspěšně zaplacen a je nyní plně aktivní.
                  Můžete ho začít používat v našem salonu Bar.Bitch Brno.
                </div>
              </td>
            </tr>

            <tr>
              <td class="px" style="padding:0 24px 8px 24px;">
                <div style="font-family:Arial,Helvetica,sans-serif;font-size:20px;font-weight:700;color:#ffffff;text-align:center;margin:0;">
                  Detaily voucheru
                </div>
              </td>
            </tr>

            <tr>
              <td class="px" style="padding:8px 24px 18px 24px;">
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#0f0f0f;border:1px solid #2a2a2a;border-radius:8px;">
                  <tr>
                    <td style="padding:16px 18px;">
                      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                        <tr>
                          <td style="font-family:Arial,Helvetica,sans-serif;font-size:15px;color:#bdbdbd;padding:6px 0;">
                            <strong style="color:#ffffff;">Objednatel:</strong> ${safeBuyer}
                          </td>
                        </tr>
                        <tr>
                          <td style="font-family:Arial,Helvetica,sans-serif;font-size:15px;color:#bdbdbd;padding:6px 0;">
                            <strong style="color:#ffffff;">Pro:</strong> ${safeRecipient}
                          </td>
                        </tr>
                        <tr>
                          <td style="font-family:Arial,Helvetica,sans-serif;font-size:15px;color:#bdbdbd;padding:6px 0;">
                            <strong style="color:#ffffff;">ID voucheru:</strong> ${safeVoucherId}
                          </td>
                        </tr>
                        <tr>
                          <td style="font-family:Arial,Helvetica,sans-serif;font-size:15px;color:#bdbdbd;padding:6px 0;">
                            <strong style="color:#ffffff;">Platný do:</strong> ${safeValidUntil}
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr>
              <td class="px" style="padding:0 24px 8px 24px;">
                <div style="font-family:Arial,Helvetica,sans-serif;font-size:20px;font-weight:700;color:#ffffff;text-align:center;margin:0;">
                  Jak voucher použít?
                </div>
              </td>
            </tr>
            <tr>
              <td class="px" style="padding:8px 24px 4px 24px;">
                <div style="font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:22px;color:#e6e6e6;margin:0;">
                  1) Přijďte do našeho salonu Bar.Bitch Brno na adrese Křenová 294/16, 602 00 Brno.
                </div>
              </td>
            </tr>
            <tr>
              <td class="px" style="padding:6px 24px;">
                <div style="font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:22px;color:#e6e6e6;margin:0;">
                  2) Předložte voucher vytištěný nebo z mobilu.
                </div>
              </td>
            </tr>
            <tr>
              <td class="px" style="padding:6px 24px 18px 24px;">
                <div style="font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:22px;color:#e6e6e6;margin:0;">
                  3) Vychutnejte si naše služby! 💅
                </div>
              </td>
            </tr>

            <tr>
              <td class="px" style="padding:0 24px;">
                <div style="font-family:Arial,Helvetica,sans-serif;font-size:20px;font-weight:700;color:#ffffff;text-align:center;margin:0;">
                  Důležité informace
                </div>
              </td>
            </tr>
            <tr>
              <td class="px" style="padding:8px 24px 8px 24px;">
                <div style="font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:22px;color:#e6e6e6;margin:0;">
                  Podrobné informace a pravidla najdete zde:
                  <a href="https://barbitch.cz/darkovy-voucher" style="color:#e71e6e;text-decoration:underline;">Podmínky</a>
                </div>
              </td>
            </tr>
            <tr>
              <td class="px" style="padding:0 24px 20px 24px;">
                <ul style="margin:8px 0 0 18px;padding:0;font-family:Arial,Helvetica,sans-serif;color:#e6e6e6;font-size:15px;line-height:22px;">
                  <li>Voucher lze uplatnit jednorázově na libovolnou službu z naší nabídky.</li>
                  <li>Je-li cena služby nižší, rozdíl se nevrací.</li>
                  <li>Je-li cena vyšší, rozdíl doplatíte na místě.</li>
                  <li>Platnost voucheru je uvedena výše.</li>
                </ul>
              </td>
            </tr>

            <tr>
              <td align="center" style="padding:8px 24px 28px 24px;">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                  <tr>
                    <td bgcolor="#e71e6e" style="border-radius:6px;">
                      <a href="mailto:info@barbitch.cz"
                         style="display:inline-block;padding:12px 24px;font-family:Arial,Helvetica,sans-serif;font-size:15px;font-weight:700;color:#ffffff;text-decoration:none;background:#e71e6e;border-radius:6px;">
                        Kontaktujte nás
                      </a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr>
              <td class="px" style="padding:16px 24px 8px 24px;text-align:center;background:#e71e6e;">
                <div style="font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:18px;color:#1f1f1f;">
                  © Bar.Bitch Brno, Křenová 294/16, 602 00 Brno • Kontakt:
                  <a href="mailto:info@barbitch.cz" style="color:#161615;">info@barbitch.cz</a>
                </div>
              </td>
            </tr>
            <tr>
              <td class="px" style="padding:8px 24px 24px 24px;text-align:center;background:#e71e6e;">
                <div style="font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:18px;color:#1f1f1f;">
                  Pokud si již nepřejete dostávat naše emaily,
                  napište nám na
                  <a href="mailto:info@barbitch.cz?subject=Odhlásit odběr" style="color:#161615;">info@barbitch.cz</a>.
                </div>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`

    const { data, error } = await resend.emails.send({
      from: 'Bar.Bitch <info@barbitch.cz>',
      to: [email],
      subject: 'Váš voucher je aktivní - Bar.Bitch',
      html: htmlTemplate,
    })

    if (error) {
      console.error('Error sending email:', error)
      return NextResponse.json({ error: error.message }, { status: 500, headers: cors })
    }

    return NextResponse.json({ success: true, data }, { status: 200, headers: cors })
  } catch (error) {
    console.error('Error in send-confirmation-voucher API:', error)
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500, headers: cors })
  }
}
