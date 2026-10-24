'use client'

import type { IVoucherCheckoutStatus } from 'app/book/fetch/engine'

import { getVoucherCheckout } from 'app/book/fetch/engine'
import { sendGoogleAdsConversion } from 'fetch/googleAds'
import { sendCAPIEvent } from 'fetch/pixel'
import { readCheckout, rememberCheckout } from 'lib/voucherCheckout'
import { formatKc } from 'lib/vouchers'
import { CircleCheckBig, CircleX, LoaderCircle } from 'lucide-react'
import Link from 'next/link'
import { useCallback, useEffect, useRef, useState } from 'react'

// Styl jako stránka odhlášení / rezervace: tmavé pozadí, karta #252523.
const CARD = 'bg-[#252523] rounded-special-small p-6 text-center'
const PRIMARY_BTN =
  'block w-full bg-[#E71E6E] hover:bg-[#c9195f] active:bg-[#b01555] transition-colors duration-150 text-white font-semibold text-xs1 py-3.5 rounded-special-small'
const SECONDARY_LINK = 'inline-block mt-4 text-xss text-[#A0A0A0] underline underline-offset-4'

const POLL_MS = 3000
/** ~2 minuty čekání na potvrzení od banky, pak jen tlačítko „Zkontrolovat znovu“. */
const POLL_MAX = 40

type View = IVoucherCheckoutStatus | 'loading' | 'not_found'

/** Purchase až po skutečném zaplacení a jen jednou (kontakt z objednávky v tomto okně). */
const trackPurchase = (token: string, price: number) => {
  const contact = readCheckout(token)
  if (!contact || contact.tracked) return
  const conversion = { currency: 'CZK', value: price }
  sendCAPIEvent('Purchase', { email: contact.email, phone: contact.phone }, conversion)
  sendGoogleAdsConversion('Purchase', { email: contact.email, phone: contact.phone }, conversion)
  rememberCheckout(token, { ...contact, tracked: true })
}

export const ThankYouClient = ({ token }: { token: string }) => {
  const [view, setView] = useState<View>(token ? 'loading' : 'not_found')
  const [polls, setPolls] = useState(0)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const load = useCallback(async () => {
    try {
      const data = await getVoucherCheckout(token)
      setView(data)
      if (data.status === 'paid') trackPurchase(token, data.price)
    } catch (err) {
      const status = (err as { response?: { status?: number } })?.response?.status
      if (status === 404) setView('not_found')
      // jiná chyba (síť, restart serveru) — zkusí se při dalším kole
    } finally {
      setPolls((n) => n + 1)
    }
  }, [token])

  useEffect(() => {
    if (token) load()
  }, [token, load])

  const pending = view === 'loading' || (typeof view === 'object' && view.status === 'pending')
  const waiting = pending && polls < POLL_MAX

  useEffect(() => {
    if (!waiting || polls === 0) return
    timer.current = setTimeout(load, POLL_MS)
    return () => {
      if (timer.current) clearTimeout(timer.current)
    }
  }, [waiting, polls, load])

  if (view === 'not_found') {
    return (
      <div className={CARD}>
        <p className={'text-white text-resMd1 mb-1'}>{'Objednávka nenalezena'}</p>
        <p className={'text-[#A0A0A0] text-xss mb-5'}>
          {'Odkaz je neplatný. Pokud jste platila a voucher nepřišel, napište nám nebo zavolejte.'}
        </p>
        <Link href={'/darkovy-voucher'} className={PRIMARY_BTN}>
          {'Zpět na vouchery'}
        </Link>
      </div>
    )
  }

  if (pending) {
    return (
      <div className={CARD} role={'status'}>
        {waiting ? (
          <LoaderCircle className={'animate-spin w-9 h-9 mx-auto mb-4 text-[#E71E6E]'} />
        ) : null}
        <p className={'text-white text-resMd1 mb-1'}>
          {waiting ? 'Ověřujeme platbu…' : 'Platba se ještě zpracovává'}
        </p>
        <p className={'text-[#A0A0A0] text-xss'}>
          {waiting
            ? 'Chvilku strpení, banka potvrzuje platbu. Stránku nezavírejte.'
            : 'Jakmile banka platbu potvrdí, pošleme vám voucher v PDF e-mailem. Stránku můžete zavřít.'}
        </p>
        {!waiting && (
          <button
            type={'button'}
            onClick={() => {
              setPolls(0)
              load()
            }}
            className={`${PRIMARY_BTN} mt-5`}
          >
            {'Zkontrolovat znovu'}
          </button>
        )}
      </div>
    )
  }

  const data = view as IVoucherCheckoutStatus

  if (data.status === 'paid') {
    return (
      <div className={CARD} role={'status'}>
        <CircleCheckBig className={'w-10 h-10 mx-auto mb-4 text-[#E71E6E]'} />
        <p className={'text-white text-resMd1 mb-2'}>{'Děkujeme, platba proběhla!'}</p>
        <p className={'text-[#A0A0A0] text-xss mb-1'}>
          {`Zaplaceno ${formatKc(data.price)}. Voucher v PDF jsme poslali na `}
          <b className={'text-white'}>{data.email}</b>
          {'.'}
        </p>
        <p className={'text-[#A0A0A0] text-xss mb-5'}>
          {'Nevidíte ho? Podívejte se do složky Hromadné nebo Spam.'}
        </p>
        <Link href={'/book'} className={PRIMARY_BTN}>
          {'Rezervovat termín'}
        </Link>
        <Link href={'/darkovy-voucher'} className={SECONDARY_LINK}>
          {'Koupit další voucher'}
        </Link>
      </div>
    )
  }

  if (data.status === 'refunded') {
    return (
      <div className={CARD}>
        <p className={'text-white text-resMd1 mb-1'}>{'Platba byla vrácena'}</p>
        <p className={'text-[#A0A0A0] text-xss'}>
          {'Peníze za tento voucher jsme vrátili na vaši kartu. Voucher už neplatí.'}
        </p>
      </div>
    )
  }

  return (
    <div className={CARD} role={'alert'}>
      <CircleX className={'w-10 h-10 mx-auto mb-4 text-[#A0A0A0]'} />
      <p className={'text-white text-resMd1 mb-2'}>{'Platba neproběhla'}</p>
      <p className={'text-[#A0A0A0] text-xss mb-5'}>
        {'Peníze vám nebyly strženy. Můžete to zkusit znovu, třeba jinou kartou.'}
      </p>
      <Link
        href={`/darkovy-voucher?voucher=${encodeURIComponent(data.voucherId)}#objednavka`}
        className={PRIMARY_BTN}
      >
        {'Zkusit znovu'}
      </Link>
    </div>
  )
}
