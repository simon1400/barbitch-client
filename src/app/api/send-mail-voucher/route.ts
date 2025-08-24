import type { NextRequest } from 'next/server'

import fs from 'node:fs'
import path from 'node:path'
import { addMonths, format } from 'date-fns'
import { Attachment, EmailParams, MailerSend, Recipient, Sender } from 'mailersend'
import { NextResponse } from 'next/server'
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'

import { htmlTemplate } from './htmlTemplate'

const mailerSend = new MailerSend({
  apiKey: process.env.MAILERSEND_API_KEY!,
})

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

    const from = new Sender(process.env.MAILERSEND_FROM_EMAIL!, 'Bar.Bitch Brno')
    const to = [new Recipient(email, name || undefined)]

    const personalization = [
      {
        email,
        data: {
          name,
          sum,
          idVoucher,
        },
      },
    ]

    const emailParams = new EmailParams()
      .setFrom(from)
      .setTo(to)
      // .setBcc(
      //   process.env.MAILERSEND_BCC_EMAIL ? [new Recipient(process.env.MAILERSEND_BCC_EMAIL)] : [],
      // )
      .setSubject('Děkujeme za objednávku, {{ name }}!')
      .setText('Objednávka pro {{ name }}, částka {{ sum }} Kč, VS {{ idVoucher }}')
      .setHtml(htmlTemplate)
      .setPersonalization(personalization)
      .setAttachments([
        new Attachment(pdfBase64, `v_${voucher}_${idVoucher}.pdf`, 'attachment', 'application/pdf'),
      ])

    await mailerSend.email.send(emailParams)

    return NextResponse.json({ message: 'Email sent successfully' })
  } catch (error: any) {
    console.error('MailerSend error:', error?.body || error)
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
  }
}
