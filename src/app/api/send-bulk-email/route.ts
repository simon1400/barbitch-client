/* eslint-disable import/order */

import type { NextRequest } from 'next/server'

import { Buffer } from 'node:buffer'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

// Роут ТОЛЬКО server-to-server: его дёргает Strapi (api::campaign) после
// проверки JWT владельца и фильтрации получателей. Из браузера сюда больше
// никто не ходит, поэтому CORS не нужен.
//
// 🟥 Почему появился секрет (s175): раньше роут был открыт в интернет без
// какой-либо авторизации с Access-Control-Allow-Origin:* — кто угодно мог
// слать до 100 писем за запрос от имени info@barbitch.cz на произвольные
// адреса. Чужой спам с верифицированного домена убивает доставляемость ВСЕХ
// писем салона, включая подтверждения броней.
// Секрет живёт в .env Strapi и клиента (одинаковый), в браузерный бандл не
// попадает. Нет секрета в окружении → 503, режим fail-closed.

// Белый список шаблонов. Имя подставляется в path.join, поэтому без списка
// «шаблон» вида ../../../secret прочитал бы посторонний .html с диска.
const TEMPLATES = new Set([
  'win-back',
  'birthday-discount',
  'window-cross-sell',
  'window-cross-sell-junior',
])

const timingSafeEqual = (a: string, b: string): boolean => {
  const bufA = Buffer.from(a)
  const bufB = Buffer.from(b)
  if (bufA.length !== bufB.length) return false
  return crypto.timingSafeEqual(bufA, bufB)
}

interface EmailRecipient {
  email: string
  variables?: Record<string, string>
}

interface BulkEmailRequest {
  template: string
  subject: string
  recipients: EmailRecipient[]
}

export async function POST(req: NextRequest) {
  try {
    const secret = process.env.CAMPAIGN_SEND_SECRET
    if (!secret) {
      return NextResponse.json({ error: 'Campaign sending is not configured' }, { status: 503 })
    }
    const provided = req.headers.get('x-campaign-secret') || ''
    if (!timingSafeEqual(provided, secret)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { template, subject, recipients }: BulkEmailRequest = await req.json()

    // Validate required fields
    if (!template || !subject || !recipients || recipients.length === 0) {
      return NextResponse.json(
        { error: 'Template, subject and recipients are required' },
        { status: 400 },
      )
    }

    if (!TEMPLATES.has(template)) {
      return NextResponse.json({ error: `Unknown template "${template}"` }, { status: 400 })
    }

    // Load HTML template
    const templatePath = path.join(
      process.cwd(),
      'src',
      'app',
      'api',
      'email-templates',
      `${template}.html`,
    )
    let htmlTemplate: string

    try {
      htmlTemplate = fs.readFileSync(templatePath, 'utf-8')
    } catch {
      return NextResponse.json({ error: `Template "${template}" not found` }, { status: 404 })
    }

    // Prepare batch emails
    const batchEmails = recipients.map((recipient) => {
      // Replace variables in template
      let personalizedHtml = htmlTemplate
      if (recipient.variables) {
        Object.entries(recipient.variables).forEach(([key, value]) => {
          const regex = new RegExp(`{{${key}}}`, 'g')
          personalizedHtml = personalizedHtml.replace(regex, value)
        })
      }

      return {
        from: 'Bar.Bitch <info@barbitch.cz>',
        to: [recipient.email],
        subject,
        html: personalizedHtml,
        // Сигнал отписки для спам-фильтров (Gmail/Seznam показывают «Unsubscribe»).
        // mailto — без отдельного endpoint; ответ «NEZASÍLAT» обрабатывается вручную.
        headers: {
          'List-Unsubscribe': '<mailto:info@barbitch.cz?subject=NEZASILAT>',
        },
      }
    })

    // Send emails using Resend batch API (up to 100 emails per request)
    const batchSize = 100
    const batches = []
    for (let i = 0; i < batchEmails.length; i += batchSize) {
      batches.push(batchEmails.slice(i, i + batchSize))
    }

    let successful = 0
    let failed = 0
    const allResults: Array<{ id?: string; error?: any }> = []

    for (const batch of batches) {
      try {
        const result = await resend.batch.send(batch)

        // Resend batch returns nested structure: { data: { data: [...] } }
        const batchResults = (result.data as any)?.data

        if (batchResults && Array.isArray(batchResults)) {
          // Each item in data is { id: string }
          successful += batchResults.length
          allResults.push(...batchResults.map((item: any) => ({ id: item.id })))
        } else {
          // If no data, treat as failure
          failed += batch.length
          allResults.push(...batch.map(() => ({ error: 'No response data' })))
        }
      } catch (error) {
        // If batch fails, mark all emails in this batch as failed
        console.error('Batch send error:', error)
        failed += batch.length
        allResults.push(...batch.map(() => ({ error: 'Batch send failed' })))
      }
    }

    return NextResponse.json(
      {
        success: true,
        total: recipients.length,
        successful,
        failed,
        results: recipients.map((recipient, i) => ({
          email: recipient.email,
          status: allResults[i]?.error ? 'rejected' : 'fulfilled',
          error: allResults[i]?.error || null,
          id: allResults[i]?.id || null,
        })),
      },
      { status: 200 },
    )
  } catch (error) {
    console.error('Error in send-bulk-email API:', error)
    return NextResponse.json({ error: 'Failed to send emails' }, { status: 500 })
  }
}
