import type { NextRequest } from 'next/server'

import { Buffer } from 'node:buffer'
import { clientIp, makeRateLimiter, sameOrigin } from 'lib/route-guard'
import { NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY!)

const limit = makeRateLimiter(5, 60_000)

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

type ParsedResume =
  | { ok: true; attachment: { filename: string; content: Buffer } | null }
  | { ok: false; status: number; error: string }

const parseResume = async (resume: FormDataEntryValue | null): Promise<ParsedResume> => {
  if (!(resume instanceof File) || resume.size === 0) return { ok: true, attachment: null }
  if (resume.size > MAX_RESUME_BYTES) return { ok: false, status: 413, error: 'Resume too large' }
  if (resume.type && !ALLOWED_RESUME_TYPES.has(resume.type)) {
    return { ok: false, status: 415, error: 'Unsupported resume type' }
  }
  const safeFilename = (resume.name || 'zivotopis').replaceAll(/[^\w.\-() ]/g, '_').slice(0, 150)
  return {
    ok: true,
    attachment: { filename: safeFilename, content: Buffer.from(await resume.arrayBuffer()) },
  }
}

export async function POST(req: NextRequest) {
  try {
    if (!sameOrigin(req)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
    if (!limit(clientIp(req))) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
    }

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
    const parsed = await parseResume(resume)
    if (!parsed.ok) {
      return NextResponse.json({ error: parsed.error }, { status: parsed.status })
    }
    const attachment = parsed.attachment

    const html = `
      <div style="font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:24px;color:#161615;">
        <h2 style="margin:0 0 16px;font-size:20px;">Nová reakce na inzerát — lashmakerka</h2>
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
