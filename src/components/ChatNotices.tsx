'use client'

import Button from 'components/Button'
import { useEffect, useRef, useState } from 'react'

/* ─── Чат (s272): «offline» вне часов салона и поле «e-mail nebo telefon» ─── */

const API = process.env.NEXT_PUBLIC_APP_API || 'https://strapi.barbitch.cz'

/** Ответ GET /api/chat/status — часы салона из salon_hours (strapi chat-core.chatStatusOf). */
export interface ChatStatus {
  online: boolean
  closesAt: string | null
  next: { date: string; time: string; inDays: number } | null
}

export interface ChatContact {
  type: 'email' | 'phone'
  value: string
}

/* «v neděli», «ve středu» — Intl отдаёт именительный падеж («neděle») */
const WEEKDAY_IN = [
  'v neděli',
  'v pondělí',
  'v úterý',
  've středu',
  've čtvrtek',
  'v pátek',
  'v sobotu',
]

const nextLabel = (next: ChatStatus['next']) => {
  if (!next) return 'co nejdříve'
  if (next.inDays === 0) return `dnes od ${next.time}`
  if (next.inDays === 1) return `zítra od ${next.time}`
  const d = new Date(`${next.date}T12:00:00Z`)
  return `${WEEKDAY_IN[d.getUTCDay()]} ${d.getUTCDate()}. ${d.getUTCMonth() + 1}. od ${next.time}`
}

export function OfflineNotice({
  status,
  compact,
  onBook,
}: {
  status: ChatStatus
  compact: boolean
  onBook: () => void
}) {
  /* в начатом чате — одна строка, чтобы не вытеснять переписку */
  if (compact)
    return (
      <div className={'px-4 py-2 border-b border-white/10 bg-white/5 text-white/70 text-[12px]'}>
        {`Mimo otevírací dobu · odpovíme ${nextLabel(status.next)} · `}
        <a href={'/book'} onClick={onBook} className={'text-primary font-bold underline'}>
          {'Rezervovat online'}
        </a>
      </div>
    )
  return (
    <div className={'px-4 py-3 border-b border-white/10 bg-white/5'}>
      <p className={'text-white text-[14px] font-normal leading-snug'}>
        {'Teď jsme mimo otevírací dobu. Odpovíme vám '}
        <strong>{nextLabel(status.next)}</strong>
        {'.'}
      </p>
      <p className={'text-white/50 text-[13px] font-normal mt-1 mb-3'}>
        {'Online rezervace funguje nonstop.'}
      </p>
      <Button text={'Rezervovat termín'} href={'/book'} inverse small onClick={onBook} />
    </div>
  )
}

const fmtPhone = (p: string) => {
  const m = /^\+420(\d{3})(\d{3})(\d{3})$/.exec(p)
  return m ? `+420 ${m[1]} ${m[2]} ${m[3]}` : p
}

export function ContactCard({
  sessionId,
  visitorName,
  offline,
  onSaved,
}: {
  sessionId: string
  visitorName: string
  offline: boolean
  onSaved: (c: ChatContact) => void
}) {
  const [value, setValue] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const boxRef = useRef<HTMLDivElement>(null)

  /* ошибка под полем — показать целиком */
  useEffect(() => {
    if (error) boxRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [error])

  const save = async () => {
    if (!value.trim() || saving) return
    setSaving(true)
    setError('')
    try {
      const res = await fetch(`${API}/api/chat/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, contact: value.trim(), visitorName }),
      })
      const data = await res.json().catch(() => null)
      if (res.ok && data?.type) onSaved({ type: data.type, value: data.value })
      else
        setError(
          data?.error?.code === 'bad_contact'
            ? 'Zadejte platný e-mail nebo telefon'
            : 'Nepodařilo se uložit, zkuste to znovu',
        )
    } catch {
      setError('Nepodařilo se uložit, zkuste to znovu')
    }
    setSaving(false)
  }

  return (
    <div ref={boxRef} className={'flex justify-start'} data-chat-contact={''}>
      <div className={'max-w-[90%] px-3 py-3 bg-white/10 text-white'}>
        <p className={'text-[14px] font-bold mb-1'}>{'Ať vám odpověď neuteče'}</p>
        <p className={'text-[13px] font-normal leading-snug text-white/60 mb-3'}>
          {offline
            ? 'Nechte e-mail nebo telefon — ozveme se, jakmile otevřeme.'
            : 'Nechte e-mail nebo telefon — kdybyste odešli, ozveme se.'}
        </p>
        <div className={'flex gap-2'}>
          <input
            type={'text'}
            inputMode={'email'}
            autoComplete={'email'}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && save()}
            placeholder={'E-mail nebo telefon'}
            aria-label={'E-mail nebo telefon'}
            className={
              'flex-1 min-w-0 bg-white/10 text-white px-3 py-2 text-sm outline-none placeholder:text-white/40 border border-white/10 focus:border-primary/50 transition-colors'
            }
          />
          <button
            type={'button'}
            onClick={save}
            disabled={!value.trim() || saving}
            className={
              'px-3 py-2 bg-primary text-white font-bold text-sm hover:bg-primary/90 transition-colors disabled:opacity-40 flex-shrink-0'
            }
          >
            {'Uložit'}
          </button>
        </div>
        {error && <p className={'text-sm text-red-400 mt-2'}>{error}</p>}
      </div>
    </div>
  )
}

export function ContactSaved({
  contact,
  onChange,
}: {
  contact: ChatContact
  onChange: () => void
}) {
  return (
    <p className={'text-center text-white/40 text-[12px]'}>
      {contact.type === 'email'
        ? `✓ Kdybyste odešli, odpověď vám pošleme na ${contact.value}`
        : `✓ Kdybyste odešli, napíšeme vám SMS na ${fmtPhone(contact.value)}`}
      {' · '}
      <button type={'button'} onClick={onChange} className={'underline hover:text-white'}>
        {'změnit'}
      </button>
    </p>
  )
}
