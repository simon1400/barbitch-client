/* eslint-disable import/order */
import type { PDFFont, PDFPage } from 'pdf-lib'

import fs from 'node:fs'
import path from 'node:path'
import fontkit from '@pdf-lib/fontkit'
import { cmyk, PDFDocument, rgb, StandardFonts } from 'pdf-lib'

// Šablony leží v public/vouchers/<částka>.pdf. Voucher na službu nemá vlastní
// šablonu: bere se 1000.pdf a řádek „1.000Kč“ se přelije barvou pozadí
// a nahradí názvem služby.
const VOUCHERS_DIR = path.join(process.cwd(), 'public', 'vouchers')
const FONTS_DIR = path.join(process.cwd(), 'public', 'fonts')
const SERVICE_BASE_TEMPLATE = '1000'

// Barva pozadí šablony přesně tak, jak je v PDF (CMYK) — RGB by se v tisku
// a v jiných prohlížečích od pozadí lišilo.
const VOUCHER_PINK = cmyk(0, 0.95, 0.25, 0)
const WHITE = rgb(1, 1, 1)

// Souřadnice v bodech (šablona 238 × 522 pt, počátek vlevo dole).
const AMOUNT_BAND = { y: 168, height: 41 }
const TEXT_WIDTH = 204
// Jméno obdarované v rámečku „pro:“ (stejně jako před s274).
const NAME_Y = 91.5
const NAME_SIZE = 24

export interface VoucherPdfInput {
  /** Částka (název šablony 500/1000/1500/2000) — pro voucher na částku. */
  amount?: string
  /** Název služby — pro voucher na službu (pak se `amount` ignoruje). */
  serviceTitle?: string
  /** Jméno obdarované — jediný text v rámečku „pro:“. */
  forName: string
  validUntil: string
  idVoucher: string
}

const readFont = (file: string) => fs.readFileSync(path.join(FONTS_DIR, file))

const centeredX = (pageWidth: number, text: string, font: PDFFont, size: number) =>
  (pageWidth - font.widthOfTextAtSize(text, size)) / 2

/** Rozdělí název na dva řádky co nejpodobnější délky. */
const splitInTwo = (text: string): [string, string] => {
  const words = text.split(/\s+/)
  let best: [string, string] = [text, '']
  let bestDiff = Infinity
  for (let i = 1; i < words.length; i++) {
    const a = words.slice(0, i).join(' ')
    const b = words.slice(i).join(' ')
    const diff = Math.abs(a.length - b.length)
    if (diff < bestDiff) {
      best = [a, b]
      bestDiff = diff
    }
  }
  return best
}

const drawServiceTitle = (page: PDFPage, title: string, font: PDFFont) => {
  const { width } = page.getSize()
  page.drawRectangle({
    x: 0,
    y: AMOUNT_BAND.y,
    width,
    height: AMOUNT_BAND.height,
    color: VOUCHER_PINK,
  })

  const text = title.toUpperCase()
  const oneLineSize = Math.min(30, TEXT_WIDTH / font.widthOfTextAtSize(text, 1))
  const twoLines = oneLineSize < 16 && text.includes(' ')
  const lines = twoLines ? splitInTwo(text) : [text]
  const size = twoLines
    ? Math.min(17, ...lines.map((l) => TEXT_WIDTH / font.widthOfTextAtSize(l, 1)))
    : oneLineSize
  const lineGap = size * 1.02
  const blockHeight = size * 0.72 + lineGap * (lines.length - 1)
  let y = AMOUNT_BAND.y + (AMOUNT_BAND.height - blockHeight) / 2 + lineGap * (lines.length - 1)

  for (const line of lines) {
    page.drawText(line, { x: centeredX(width, line, font, size), y, size, font, color: WHITE })
    y -= lineGap
  }
}

/** Jméno obdarované do rámečku „pro:“ — jiný text se na voucher netiskne. */
const drawName = (page: PDFPage, forName: string, font: PDFFont) => {
  const name = forName.trim()
  if (!name) return
  const { width } = page.getSize()
  page.drawText(name, {
    x: centeredX(width, name, font, NAME_SIZE),
    y: NAME_Y,
    size: NAME_SIZE,
    font,
    color: WHITE,
  })
}

/** Vyplněný voucher jako PDF (bajty). */
export const buildVoucherPdf = async (input: VoucherPdfInput): Promise<Uint8Array> => {
  const template = input.serviceTitle ? SERVICE_BASE_TEMPLATE : (input.amount ?? '')
  const templatePath = path.join(VOUCHERS_DIR, `${template}.pdf`)
  if (!template || !templatePath.startsWith(VOUCHERS_DIR + path.sep)) {
    throw new Error('Invalid voucher template')
  }

  const pdfDoc = await PDFDocument.load(fs.readFileSync(templatePath))
  pdfDoc.registerFontkit(fontkit)
  const [page] = pdfDoc.getPages()
  const { height } = page.getSize()

  const standardFont = await pdfDoc.embedFont(StandardFonts.Helvetica)
  let scriptFont: PDFFont
  try {
    scriptFont = await pdfDoc.embedFont(readFont('MeowScript-Regular.ttf'))
  } catch {
    scriptFont = standardFont
  }

  if (input.serviceTitle) {
    const titleFont = await pdfDoc.embedFont(readFont('Montserrat-ExtraBold.ttf'), { subset: true })
    drawServiceTitle(page, input.serviceTitle, titleFont)
  }

  drawName(page, input.forName, scriptFont)

  page.drawText(input.validUntil, {
    x: 150,
    y: height - 482,
    size: 10,
    font: standardFont,
    color: WHITE,
  })
  page.drawText(String(input.idVoucher), {
    x: 95,
    y: height - 502,
    size: 10,
    font: standardFont,
    color: WHITE,
  })

  return pdfDoc.save()
}
