/* eslint-disable import/order */

import type { NextRequest } from 'next/server'

import fs from 'node:fs'
import path from 'node:path'
import { NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

// Add CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders })
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
    const { template, subject, recipients }: BulkEmailRequest = await req.json()

    // Validate required fields
    if (!template || !subject || !recipients || recipients.length === 0) {
      return NextResponse.json(
        { error: 'Template, subject and recipients are required' },
        { status: 400, headers: corsHeaders },
      )
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
      return NextResponse.json(
        { error: `Template "${template}" not found` },
        { status: 404, headers: corsHeaders },
      )
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
      { status: 200, headers: corsHeaders },
    )
  } catch (error) {
    console.error('Error in send-bulk-email API:', error)
    return NextResponse.json(
      { error: 'Failed to send emails' },
      { status: 500, headers: corsHeaders },
    )
  }
}
