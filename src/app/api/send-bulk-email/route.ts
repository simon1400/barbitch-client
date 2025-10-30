/* eslint-disable sonarjs/no-ignored-exceptions */
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
    } catch (error) {
      return NextResponse.json(
        { error: `Template "${template}" not found` },
        { status: 404, headers: corsHeaders },
      )
    }

    // Send emails to all recipients
    const results = await Promise.allSettled(
      recipients.map(async (recipient) => {
        // Replace variables in template
        let personalizedHtml = htmlTemplate
        if (recipient.variables) {
          Object.entries(recipient.variables).forEach(([key, value]) => {
            const regex = new RegExp(`{{${key}}}`, 'g')
            personalizedHtml = personalizedHtml.replace(regex, value)
          })
        }

        return resend.emails.send({
          from: 'Bar.Bitch <info@barbitch.cz>',
          to: [recipient.email],
          subject,
          html: personalizedHtml,
        })
      }),
    )

    // Count successes and failures
    const successful = results.filter((r) => r.status === 'fulfilled').length
    const failed = results.filter((r) => r.status === 'rejected').length

    return NextResponse.json(
      {
        success: true,
        total: recipients.length,
        successful,
        failed,
        results: results.map((r, i) => ({
          email: recipients[i].email,
          status: r.status,
          error: r.status === 'rejected' ? r.reason : null,
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
