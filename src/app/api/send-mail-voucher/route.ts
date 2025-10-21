import type { NextRequest } from 'next/server'

import fs from 'node:fs'
import path from 'node:path'
import { addMonths, format } from 'date-fns'
import { NextResponse } from 'next/server'
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'
import { Resend } from 'resend'

import { htmlTemplate } from './htmlTemplate'

const resend = new Resend(process.env.RESEND_API_KEY!)

export async function POST(req: NextRequest) {
  try {
    const { email, name, sum, idVoucher, voucher } = await req.json()

    if (!email) {
      return NextResponse.json({ error: 'Missing required field: email' }, { status: 400 })
    }

    const templatePath = path.join(process.cwd(), 'public', 'vouchers', `${voucher}.pdf`)
    const templateBytes = fs.readFileSync(templatePath)

    const pdfDoc = await PDFDocument.load(templateBytes)
    const [firstPage] = pdfDoc.getPages()
    const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

    firstPage.drawText(String(idVoucher), {
      x: 190,
      y: 30,
      size: 22,
      font,
      color: rgb(0, 0, 0),
    })

    const sixMonthsFromNow = addMonths(new Date(), 6)
    const formattedDate = format(sixMonthsFromNow, 'dd.MM.yyyy')

    firstPage.drawText(formattedDate, {
      x: 320,
      y: 70,
      size: 22,
      font,
      color: rgb(0, 0, 0),
    })

    const modifiedPdf = await pdfDoc.save()
    // eslint-disable-next-line ts/no-require-imports
    const pdfBase64 = require('node:buffer').Buffer.from(modifiedPdf).toString('base64')

    // Заменяем персонализацию в HTML шаблоне
    const personalizedHtml = htmlTemplate
      .replace(/\{\{ name \}\}/g, name || 'Zákazník')
      .replace(/\{\{ sum \}\}/g, String(sum))
      .replace(/\{\{ idVoucher \}\}/g, String(idVoucher))

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
