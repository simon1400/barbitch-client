import { serviceRowHtml, voucherRulesHtml } from '../send-mail-voucher/voucherRules'

// Šablona e-mailu „Váš voucher je aktivní“ (posílá se po potvrzení platby v adminu).
// Vstupy už escapované (route.ts); `service` — voucher na konkrétní službu (s274), jinak null.
export const confirmationHtml = ({
  safeBuyer,
  safeRecipient,
  safeVoucherId,
  safeValidUntil,
  service,
}: {
  safeBuyer: string
  safeRecipient: string
  safeVoucherId: string
  safeValidUntil: string
  service: string | null
}) => `<!DOCTYPE html>
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
                        ${serviceRowHtml(service, '6px 0')}
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
                  ${voucherRulesHtml(service, 'Platnost voucheru je uvedena výše.')}
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
