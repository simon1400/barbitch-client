import type { NextRequest } from 'next/server'

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

export async function POST(req: NextRequest) {
  try {
    const { name, phone, message } = await req.json()

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

    const html = `
      <div style="font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:24px;color:#161615;">
        <h2 style="margin:0 0 16px;font-size:20px;">Nová reakce na inzerát — administrátor/ka</h2>
        <p style="margin:0 0 8px;"><strong>Jméno:</strong> ${safeName}</p>
        <p style="margin:0 0 8px;"><strong>Telefon:</strong> <a href="tel:${safePhone.replaceAll(' ', '')}">${safePhone}</a></p>
        ${safeMessage ? `<p style="margin:16px 0 4px;"><strong>Zpráva:</strong></p><p style="margin:0;white-space:pre-wrap;">${safeMessage}</p>` : ''}
        <hr style="border:none;border-top:1px solid #e5e5e5;margin:20px 0;" />
        <p style="margin:0;color:#888;font-size:13px;">Odesláno z formuláře na barbitch.cz/kariera</p>
      </div>
    `

    const { error } = await resend.emails.send({
      from: `Bar.Bitch Kariéra <${process.env.RESEND_FROM_EMAIL!}>`,
      to: [recipient],
      subject: `Nová reakce na inzerát: ${safeName}`,
      html,
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
