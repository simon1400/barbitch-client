import type { NextRequest } from 'next/server'

import { Buffer } from 'node:buffer'
import { NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY!)

const escapeHtml = (value: string) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')

// Cílový e-mail: env má přednost, jinak se vezme e-mail salonu ze Strapi.
const resolveRecipient = async (): Promise<string | null> => {
  const fromEnv = process.env.CAREER_NOTIFY_EMAIL || process.env.RESEND_BCC_EMAIL
  if (fromEnv) return fromEnv

  try {
    const apiUrl =
      process.env.NEXT_PUBLIC_APP_API || process.env.APP_API || 'https://strapi.barbitch.cz'
    const res = await fetch(`${apiUrl}/api/contact?fields[0]=email`, {
      next: { revalidate: 3600 },
    })
    const json = await res.json()
    return json?.data?.email || null
  } catch {
    return null
  }
}

// Povolené typy souborů pro životopis + limit velikosti (5 MB).
const MAX_RESUME_BYTES = 5 * 1024 * 1024
const ALLOWED_RESUME_TYPES = new Set([
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/heic',
])

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData()
    const name = form.get('name')
    const phone = form.get('phone')
    const message = form.get('message')
    const resume = form.get('resume')

    if (!name || !phone) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const recipient = await resolveRecipient()
    if (!recipient) {
      console.error('career-apply: no recipient e-mail configured')
      return NextResponse.json({ error: 'No recipient configured' }, { status: 500 })
    }

    const safeName = escapeHtml(String(name)).slice(0, 200)
    const safePhone = escapeHtml(String(phone)).slice(0, 60)
    const safeMessage = message ? escapeHtml(String(message)).slice(0, 4000) : ''

    // Příloha — životopis (nepovinné).
    let attachment: { filename: string; content: Buffer } | null = null
    if (resume instanceof File && resume.size > 0) {
      if (resume.size > MAX_RESUME_BYTES) {
        return NextResponse.json({ error: 'Resume too large' }, { status: 413 })
      }
      if (resume.type && !ALLOWED_RESUME_TYPES.has(resume.type)) {
        return NextResponse.json({ error: 'Unsupported resume type' }, { status: 415 })
      }
      const safeFilename = (resume.name || 'zivotopis')
        .replaceAll(/[^\w.\-() ]/g, '_')
        .slice(0, 150)
      attachment = {
        filename: safeFilename,
        content: Buffer.from(await resume.arrayBuffer()),
      }
    }

    const html = `
      <div style="font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:24px;color:#161615;">
        <h2 style="margin:0 0 16px;font-size:20px;">Nová reakce na inzerát — administrátor/ka</h2>
        <p style="margin:0 0 8px;"><strong>Jméno:</strong> ${safeName}</p>
        <p style="margin:0 0 8px;"><strong>Telefon:</strong> <a href="tel:${safePhone.replaceAll(' ', '')}">${safePhone}</a></p>
        ${safeMessage ? `<p style="margin:16px 0 4px;"><strong>Zpráva:</strong></p><p style="margin:0;white-space:pre-wrap;">${safeMessage}</p>` : ''}
        <p style="margin:16px 0 0;"><strong>Životopis:</strong> ${attachment ? `${escapeHtml(attachment.filename)} (v příloze)` : 'nepřiložen'}</p>
        <hr style="border:none;border-top:1px solid #e5e5e5;margin:20px 0;" />
        <p style="margin:0;color:#888;font-size:13px;">Odesláno z formuláře na barbitch.cz/kariera</p>
      </div>
    `

    const { error } = await resend.emails.send({
      from: `Bar.Bitch Kariéra <${process.env.RESEND_FROM_EMAIL!}>`,
      to: [recipient],
      subject: `Nová reakce na inzerát: ${safeName}`,
      html,
      ...(attachment ? { attachments: [attachment] } : {}),
    })

    if (error) {
      console.error('career-apply Resend error:', error)
      return NextResponse.json({ error: 'Failed to send' }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('career-apply error:', error)
    return NextResponse.json({ error: 'Failed to send' }, { status: 500 })
  }
}
