/* eslint-disable node/prefer-global/buffer */

import type { NextRequest } from 'next/server'

import fs from "node:fs";
import path from "node:path";
import sgMail from '@sendgrid/mail'
import { addMonths, format } from 'date-fns'
import { NextResponse } from 'next/server'
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'

sgMail.setApiKey(process.env.SENDGRID_API_KEY!)

export async function POST(req: NextRequest) {
  try {
    const { email, name, sum, idVoucher, voucher } = await req.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Missing required fields: to, subject, and text or html' },
        { status: 400 },
      )
    }

    const templatePath = path.join(process.cwd(), 'public', 'vouchers', `${voucher}.pdf`)
    const templateBytes = fs.readFileSync(templatePath)

    const pdfDoc = await PDFDocument.load(templateBytes)
    const pages = pdfDoc.getPages()
    const firstPage = pages[0]

    const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

    firstPage.drawText(`${idVoucher}`, {
      x: 190,
      y: 30,
      size: 22,
      font,
      color: rgb(0, 0, 0),
    })

    const sixMonthsFromNow = addMonths(new Date(), 6)
    const formattedDate = format(sixMonthsFromNow, 'dd.MM.yyyy')

    firstPage.drawText(`${formattedDate}`, {
      x: 320,
      y: 70,
      size: 22,
      font,
      color: rgb(0, 0, 0),
    })

    const modifiedPdf = await pdfDoc.save()

    const msg: any = {
      to: email,
      bbc: process.env.SENDGRID_FROM_EMAIL!,
      from: {
        email: process.env.SENDGRID_FROM_EMAIL!,
        name: 'Bar.Bitch Brno',
      },
      templateId: process.env.SENDGRID_TEMPLATE_ID,
      dynamicTemplateData: {
        name,
        sum,
        idVoucher,
      },
      attachments: [
        {
          content: Buffer.from(modifiedPdf).toString('base64'),
          filename: `v_${voucher}_${idVoucher}.pdf`,
          type: 'application/pdf',
          disposition: 'attachment',
        },
      ],
    }

    await sgMail.send(msg)

    return NextResponse.json({ message: 'Email sent successfully' })
  } catch (error: any) {
    console.error('SendGrid error:', error.response?.body || error)
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
  }
}
