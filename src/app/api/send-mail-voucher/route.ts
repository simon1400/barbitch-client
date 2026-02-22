/* eslint-disable import/order */
/* eslint-disable perfectionist/sort-imports */
import type { NextRequest } from 'next/server'

import path from 'node:path'
import fontkit from '@pdf-lib/fontkit'
import { addMonths, format } from 'date-fns'
import { NextResponse } from 'next/server'
import fs from 'node:fs'
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'
import { Resend } from 'resend'

import { htmlTemplate } from './htmlTemplate'

const resend = new Resend(process.env.RESEND_API_KEY!)

export async function POST(req: NextRequest) {
  try {
    const {
      email,
      name,
      sum,
      idVoucher,
      voucher,
      recipientName,
      deliveryMethod,
      street,
      city,
      postalCode,
      country,
    } = await req.json()

    if (!email) {
      return NextResponse.json({ error: 'Missing required field: email' }, { status: 400 })
    }

    const templatePath = path.join(process.cwd(), 'public', 'vouchers', `${voucher}.pdf`)
    const templateBytes = fs.readFileSync(templatePath)

    const pdfDoc = await PDFDocument.load(templateBytes)
    pdfDoc.registerFontkit(fontkit)

    const [firstPage] = pdfDoc.getPages()
    const { width, height } = firstPage.getSize()

    const standardFont = await pdfDoc.embedFont(StandardFonts.Helvetica)

    // Load custom font (if available) or use standard font
    let customFont
    try {
      const fontPath = path.join(process.cwd(), 'public', 'fonts', 'MeowScript-Regular.ttf')
      const fontBytes = fs.readFileSync(fontPath)
      customFont = await pdfDoc.embedFont(fontBytes)
    } catch {
      customFont = standardFont
    }

    // Helper function to center text
    const getCenteredX = (text: string, fontSize: number) => {
      const textWidth = customFont.widthOfTextAtSize(text, fontSize)
      return (width - textWidth) / 2
    }

    // Add recipient name (pro: field) - centered
    if (recipientName) {
      const recipientNameSize = 24
      const recipientNameX = getCenteredX(recipientName, recipientNameSize)
      firstPage.drawText(recipientName, {
        x: recipientNameX,
        y: height - 430,
        size: recipientNameSize,
        font: customFont,
        color: rgb(1, 1, 1),
      })
    }

    // Expiration date
    const sixMonthsFromNow = addMonths(new Date(), 6)
    const formattedDate = format(sixMonthsFromNow, 'dd.MM.yyyy')

    firstPage.drawText(formattedDate, {
      x: 150,
      y: height - 482,
      size: 10,
      font: standardFont,
      color: rgb(1, 1, 1),
    })

    // Voucher ID
    firstPage.drawText(String(idVoucher), {
      x: 95,
      y: height - 502,
      size: 10,
      font: standardFont,
      color: rgb(1, 1, 1),
    })

    const modifiedPdf = await pdfDoc.save()
    // eslint-disable-next-line ts/no-require-imports
    const pdfBase64 = require('node:buffer').Buffer.from(modifiedPdf).toString('base64')

    // Рассчитываем итоговую сумму и формируем текст в зависимости от способа доставки
    let totalSum = Number(sum)
    if (deliveryMethod === 'mail') {
      totalSum = Number(sum) + 100
    } else if (deliveryMethod === 'pickup') {
      totalSum = Number(sum) + 50
    }

    let deliveryInstructions = ''

    if (deliveryMethod === 'email') {
      deliveryInstructions = `
        <tr>
          <td class="px" style="padding:6px 24px;">
            <div style="font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:22px;color:#e6e6e6;margin:0;">
              2) Proveďte platbu podle údajů níže, abychom váš voucher aktivovali. Voucher je již přiložen k tomuto e-mailu v PDF formátu.
            </div>
          </td>
        </tr>
      `
    } else if (deliveryMethod === 'mail') {
      const deliveryAddress = `${street}, ${postalCode} ${city}, ${country}`
      deliveryInstructions = `
        <tr>
          <td class="px" style="padding:6px 24px;">
            <div style="font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:22px;color:#e6e6e6;margin:0;">
              2) Proveďte platbu podle údajů níže (částka zahrnuje příplatek +100 Kč za poštovné). Po připsání platby vám vytištěný voucher odešleme poštou na uvedenou adresu:
            </div>
          </td>
        </tr>
        <tr>
          <td class="px" style="padding:8px 24px 4px 24px;">
            <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#0f0f0f;border:1px solid #2a2a2a;border-radius:8px;">
              <tr>
                <td style="padding:14px 16px;">
                  <div style="font-family:Arial,Helvetica,sans-serif;font-size:15px;color:#bdbdbd;">
                    <strong style="color:#ffffff;">Adresa doručení:</strong><br/>
                    ${deliveryAddress}
                  </div>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      `
    } else if (deliveryMethod === 'pickup') {
      deliveryInstructions = `
        <tr>
          <td class="px" style="padding:6px 24px;">
            <div style="font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:22px;color:#e6e6e6;margin:0;">
              2) Proveďte platbu podle údajů níže (částka zahrnuje příplatek +50 Kč za přípravu). Po připsání platby vám zašleme potvrzení s instrukcemi, kdy a kde si můžete vyzvednout vytištěný voucher v našem salonu.
            </div>
          </td>
        </tr>
      `
    }

    // Заменяем персонализацию в HTML шаблоне
    const personalizedHtml = htmlTemplate
      .replace(/\{\{ name \}\}/g, name || 'Zákazník')
      .replace(/\{\{ sum \}\}/g, String(totalSum))
      .replace(/\{\{ idVoucher \}\}/g, String(idVoucher))
      .replace(/\{\{ deliveryInstructions \}\}/g, deliveryInstructions)

    const { data, error } = await resend.emails.send({
      from: `Bar.Bitch Brno <${process.env.RESEND_FROM_EMAIL!}>`,
      to: [email],
      bcc: process.env.RESEND_BCC_EMAIL ? [process.env.RESEND_BCC_EMAIL] : undefined,
      subject: `Děkujeme za objednávku, ${name || 'Zákazník'}!`,
      html: personalizedHtml,
      attachments: [
        {
          filename: `v_${voucher}_${idVoucher}.pdf`,
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
