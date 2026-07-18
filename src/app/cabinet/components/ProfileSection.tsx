'use client'

import type { ICabinetClient } from '../fetch/cabinetApi'

import { useState } from 'react'

import { cabinetErrorCode, patchCabinetMe } from '../fetch/cabinetApi'

import { inputCls, primaryBtnCls, SectionTitle } from './shared'

const PATCH_ERRORS: Record<string, string> = {
  invalid_name: 'Neplatné jméno.',
  invalid_phone: 'Neplatný telefon.',
  invalid_birthday: 'Neplatné datum narození.',
}

interface Props {
  client: ICabinetClient
  onSaved: (next: ICabinetClient) => void
}

// Профиль: jméno/telefon/datum narození/marketing souhlas; e-mail read-only
// (identity kabinetu — смена = отдельный verify-флоу, не в К2).
export const ProfileSection = ({ client, onSaved }: Props) => {
  const [name, setName] = useState(client.name || '')
  const [phone, setPhone] = useState(client.phone || '')
  const [birthday, setBirthday] = useState(client.birthday || '')
  const [consent, setConsent] = useState(client.marketingConsent)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  const dirty =
    name !== (client.name || '') ||
    phone !== (client.phone || '') ||
    birthday !== (client.birthday || '') ||
    consent !== client.marketingConsent

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (saving || !dirty) return
    setSaving(true)
    setError('')
    setSaved(false)
    try {
      const next = await patchCabinetMe({
        name,
        phone,
        birthday: birthday || null,
        marketingConsent: consent,
      })
      onSaved(next)
      setSaved(true)
    } catch (err) {
      setError(PATCH_ERRORS[cabinetErrorCode(err)] ?? 'Uložení se nepodařilo. Zkuste to znovu.')
    } finally {
      setSaving(false)
    }
  }

  const field = (label: string, node: React.ReactNode) => (
    <label className={'block mb-3.5'}>
      <span className={'block text-[#A0A0A0] text-xss mb-1.5'}>{label}</span>
      {node}
    </label>
  )

  return (
    <section>
      <SectionTitle>{'Profil'}</SectionTitle>
      <form onSubmit={handleSave} className={'bg-[#252523] rounded-special-small px-5 py-4'}>
        {field(
          'E-mail',
          <input
            type={'email'}
            value={client.email || ''}
            disabled
            className={`${inputCls} opacity-60 cursor-not-allowed`}
          />,
        )}
        {field(
          'Jméno',
          <input
            type={'text'}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputCls}
          />,
        )}
        {field(
          'Telefon',
          <input
            type={'tel'}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder={'+420…'}
            className={inputCls}
          />,
        )}
        {field(
          'Datum narození',
          <input
            type={'date'}
            value={birthday}
            onChange={(e) => setBirthday(e.target.value)}
            className={`${inputCls} [color-scheme:dark]`}
          />,
        )}
        <label className={'flex items-start gap-2.5 mb-4 cursor-pointer'}>
          <input
            type={'checkbox'}
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            className={'mt-0.5 accent-primary'}
          />
          <span className={'text-[#A0A0A0] text-xss'}>
            {'Souhlasím se zasíláním novinek a nabídek e-mailem.'}
          </span>
        </label>
        {error && <p className={'text-[#E71E6E] text-xss mb-3'}>{error}</p>}
        {saved && !dirty && <p className={'text-[#4ade80] text-xss mb-3'}>{'✓ Uloženo.'}</p>}
        <button type={'submit'} disabled={saving || !dirty} className={primaryBtnCls(saving)}>
          {saving ? 'Ukládám…' : 'Uložit profil'}
        </button>
      </form>
    </section>
  )
}
