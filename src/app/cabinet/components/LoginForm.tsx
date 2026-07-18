'use client'

import { useState } from 'react'

import { cabinetErrorCode, cabinetErrorStatus, postCabinetLogin } from '../fetch/cabinetApi'

import { Box, inputCls, primaryBtnCls } from './shared'

// Login-форма кабинета: e-mail → magic-link письмо. Ответ сервера ВСЕГДА {ok:true}
// (существование e-mailu se neprozrazuje) → po odeslání ukazujeme «zkontrolujte e-mail».
export const LoginForm = () => {
  const [email, setEmail] = useState('')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const errorMessage = (err: unknown): string => {
    if (cabinetErrorCode(err) === 'invalid_email') return 'Zadejte prosím platný e-mail.'
    if (cabinetErrorStatus(err) === 429) {
      return 'Příliš mnoho pokusů — zkuste to prosím za chvíli znovu.'
    }
    return 'Odeslání se nepodařilo. Zkuste to prosím znovu.'
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (sending) return
    setSending(true)
    setError('')
    try {
      await postCabinetLogin(email)
      setSent(true)
    } catch (err) {
      setError(errorMessage(err))
    } finally {
      setSending(false)
    }
  }

  if (sent) {
    return (
      <Box>
        <p className={'text-white text-resMd1 mb-1'}>{'Zkontrolujte e-mail'}</p>
        <p className={'text-[#A0A0A0] text-xss'}>
          {`Pokud u nás máte účet, poslali jsme na ${email} odkaz pro přihlášení. Platí 15 minut.`}
        </p>
        <button
          type={'button'}
          onClick={() => setSent(false)}
          className={'text-[#A0A0A0] text-xss underline hover:text-white mt-4'}
        >
          {'Poslat znovu'}
        </button>
      </Box>
    )
  }

  return (
    <Box>
      <p className={'text-white text-resMd1 mb-1'}>{'Přihlášení'}</p>
      <p className={'text-[#A0A0A0] text-xss mb-5'}>
        {'Zadejte e-mail, na který máte rezervace — pošleme vám odkaz pro přihlášení.'}
      </p>
      <form onSubmit={handleSubmit} className={'flex flex-col items-center gap-3'}>
        <input
          type={'email'}
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={'vas@email.cz'}
          autoComplete={'email'}
          className={inputCls}
        />
        {error && <p className={'text-[#E71E6E] text-xss'}>{error}</p>}
        <button type={'submit'} disabled={sending} className={primaryBtnCls(sending)}>
          {sending ? 'Odesílám…' : 'Poslat přihlašovací odkaz'}
        </button>
      </form>
    </Box>
  )
}
