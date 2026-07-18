'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

import { Box } from '../components/shared'
import { cabinetErrorStatus, getCabinetVerify, setCabinetJwt } from '../fetch/cabinetApi'

type State = 'working' | 'expired' | 'disabled' | 'error'

// Приёмник magic-link (?token=): погашение токена → JWT в localStorage →
// redirect на /cabinet. Токен читается из window.location (не useSearchParams —
// без Suspense-деопта, паттерн BookCalendarClient s86).
export const VerifyClient = () => {
  const router = useRouter()
  const [state, setState] = useState<State>('working')
  const ran = useRef(false)

  useEffect(() => {
    if (ran.current) return
    ran.current = true
    const token = new URLSearchParams(window.location.search).get('token') || ''
    if (!token) {
      setState('expired')
      return
    }
    getCabinetVerify(token)
      .then((res) => {
        setCabinetJwt(res.jwt)
        router.replace('/cabinet')
      })
      .catch((err) => {
        const status = cabinetErrorStatus(err)
        if (status === 410) setState('expired')
        else if (status === 503) setState('disabled')
        else setState('error')
      })
  }, [router])

  if (state === 'working') {
    return (
      <Box>
        <p className={'text-[#A0A0A0] text-xss animate-pulse'}>{'Přihlašuji…'}</p>
      </Box>
    )
  }

  if (state === 'disabled') {
    return (
      <Box>
        <p className={'text-white text-resMd1 mb-1'}>{'Kabinet zatím není dostupný'}</p>
        <p className={'text-[#A0A0A0] text-xss'}>{'Zkuste to prosím později.'}</p>
      </Box>
    )
  }

  const expired = state === 'expired'
  return (
    <Box>
      <p className={'text-white text-resMd1 mb-1'}>
        {expired ? 'Odkaz vypršel' : 'Přihlášení se nepodařilo'}
      </p>
      <p className={'text-[#A0A0A0] text-xss mb-5'}>
        {expired
          ? 'Přihlašovací odkaz je neplatný, vypršel nebo už byl použit.'
          : 'Zkuste to prosím znovu.'}
      </p>
      <a
        className={
          'inline-block bg-primary text-white text-xs1 font-bold rounded-special-small px-6 py-3'
        }
        href={'/cabinet'}
      >
        {'Poslat nový odkaz'}
      </a>
    </Box>
  )
}
