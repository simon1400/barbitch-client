export const htmlTemplate = `<!DOCTYPE html>
<html lang="cs">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <title>Děkujeme za objednávku</title>
    <style>
      @media (max-width:600px){
        .container{width:100%!important}
        .px{padding-left:16px!important;padding-right:16px!important}
      }
    </style>
  </head>
  <body style="margin:0;padding:0;background:#1f1f1f;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;">
    <!-- розовый фон -->
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#e71e6e;">
      <tr>
        <td>
          <table role="presentation" align="center" width="600" class="container" cellspacing="0" cellpadding="0" border="0" style="margin:0 auto;background:#161615;color:#ffffff;width:600px;">
            
            <!-- логотип -->
            <tr>
              <td style="padding:24px;text-align:center;background:#e71e6e;">
                <img src="https://barbitch.cz/assets/logo-email.png" alt="Bar.Bitch" width="220" style="max-width:220px;height:auto;display:block;margin:0 auto;">
              </td>
            </tr>

            <!-- заголовок -->
            <tr>
              <td class="px" style="padding:24px 24px 0 24px;text-align:center;">
                <div style="font-family:Arial,Helvetica,sans-serif;font-size:28px;font-weight:700;line-height:1.3;color:#ffffff;margin:0;">
                  Děkujeme za vaši objednávku, {{ name }}! 🎁
                </div>
              </td>
            </tr>

            <!-- подзаголовок -->
            <tr>
              <td class="px" style="padding:16px 24px 24px 24px;text-align:center;">
                <div style="font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:22px;color:#e6e6e6;margin:0;">
                  Zkontrolujte prosím platební údaje níže – po připsání platby bude váš voucher plně
                  aktivován a připraven k použití v našem salonu Bar.Bitch Brno.
                </div>
              </td>
            </tr>

            <!-- блок: co se děje dál -->
            <tr>
              <td class="px" style="padding:0 24px 8px 24px;">
                <div style="font-family:Arial,Helvetica,sans-serif;font-size:20px;font-weight:700;color:#ffffff;text-align:center;margin:0;">
                  Co se děje dál?
                </div>
              </td>
            </tr>
            <tr>
              <td class="px" style="padding:8px 24px 4px 24px;">
                <div style="font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:22px;color:#e6e6e6;margin:0;">
                  1) V příloze najdete svůj personalizovaný voucher – můžete si ho vytisknout nebo uložit do mobilu.
                </div>
              </td>
            </tr>
            {{ deliveryInstructions }}

            <!-- платёжные реквизиты -->
            <tr>
              <td class="px" style="padding:8px 24px 4px 24px;">
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#0f0f0f;border:1px solid #2a2a2a;border-radius:8px;">
                  <tr>
                    <td style="padding:14px 16px;">
                      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                        <tr>
                          <td style="font-family:Arial,Helvetica,sans-serif;font-size:15px;color:#bdbdbd;padding:4px 0;">
                            <strong style="color:#ffffff;">Číslo účtu:</strong> 117407613 / 5500
                          </td>
                        </tr>
                        <tr>
                          <td style="font-family:Arial,Helvetica,sans-serif;font-size:15px;color:#bdbdbd;padding:4px 0;">
                            <strong style="color:#ffffff;">Částka:</strong> {{ sum }} Kč
                          </td>
                        </tr>
                        <tr>
                          <td style="font-family:Arial,Helvetica,sans-serif;font-size:15px;color:#bdbdbd;padding:4px 0;">
                            <strong style="color:#ffffff;">Variabilní symbol:</strong> {{ idVoucher }}
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr>
              <td class="px" style="padding:6px 24px 18px 24px;">
                <div style="font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:22px;color:#e6e6e6;margin:0;">
                  3) Voucher lze uhradit také osobně v našem salonu v Brně.
                </div>
              </td>
            </tr>

            <!-- jak voucher funguje -->
            <tr>
              <td class="px" style="padding:0 24px;">
                <div style="font-family:Arial,Helvetica,sans-serif;font-size:20px;font-weight:700;color:#ffffff;text-align:center;margin:0;">
                  Jak voucher funguje?
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
                  <li>Voucher je aktivní až po zaplacení.</li>
                </ul>
              </td>
            </tr>

            <!-- кнопка -->
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

            <!-- футер -->
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
</html>
`
