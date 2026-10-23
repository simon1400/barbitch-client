'use client'

import type { IUnsubscribeInfo } from '../fetch'

import { useEffect, useRef, useState } from 'react'

import { COMMENT_MAX, postUnsubscribe, postUnsubscribeReason, UNSUBSCRIBE_REASONS } from '../fetch'

// Стиль — как в бронировании: карточки #252523, строки выбора как у вариантов и
// групп дополнений (book/[serviceId]/extras/ExtrasSelector.tsx), поле текста как
// «Zanechat vzkaz» (book/reservation/…/UserData.tsx), главная кнопка как «Pokračovat».

const CARD = 'bg-[#252523] rounded-special-small'
const PRIMARY_BTN =
  'w-full transition-colors duration-150 text-white font-semibold text-xs1 py-3.5 rounded-special-small'
const PRIMARY_ON = 'bg-[#E71E6E] hover:bg-[#c9195f] active:bg-[#b01555]'
const PRIMARY_OFF = 'bg-[#5a5a5a] cursor-not-allowed'

const ERROR_TEXT = 'Něco se nepovedlo. Zkuste to prosím znovu.'

const StatusBox = ({ children }: { children: React.ReactNode }) => (
  <div className={`${CARD} p-6 text-center`}>{children}</div>
)

// Круглый индикатор — копия радио из ExtrasSelector
const RadioDot = ({ checked }: { checked: boolean }) => (
  <span
    className={`shrink-0 flex items-center justify-center w-5 h-5 rounded-full border-2 transition-colors duration-150 ${
      checked ? 'border-[#E71E6E]' : 'border-[#A0A0A0]'
    }`}
  >
    {checked && <span className={'w-2.5 h-2.5 rounded-full bg-[#E71E6E] block'} />}
  </span>
)

const Survey = ({ token }: { token: string }) => {
  const [reason, setReason] = useState('')
  const [comment, setComment] = useState('')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  if (sent) {
    return (
      <div className={`mt-2.5 ${CARD} px-4 py-4 text-center`}>
        <p className={'text-xs1 text-white'}>{'Děkujeme za zpětnou vazbu 💕'}</p>
      </div>
    )
  }

  const submit = async () => {
    if (!reason || sending) return
    setSending(true)
    setError('')
    try {
      await postUnsubscribeReason(token, reason, comment.trim())
      setSent(true)
    } catch {
      setError(ERROR_TEXT)
    } finally {
      setSending(false)
    }
  }

  const disabled = !reason || sending

  return (
    <>
      <div
        className={`mt-2.5 ${CARD} overflow-hidden`}
        role={'radiogroup'}
        aria-label={'Důvod odhlášení'}
      >
        <p className={'px-4 pt-3.5 pb-1 text-xss text-[#A0A0A0]'}>
          {'Prozradíte nám proč? (nepovinné)'}
        </p>
        {UNSUBSCRIBE_REASONS.map((r, index) => {
          const checked = reason === r.key
          return (
            <div
              key={r.key}
              className={index > 0 ? 'border-t-2 border-[#3C3C3C] border-dotted' : ''}
            >
              <button
                type={'button'}
                role={'radio'}
                aria-checked={checked}
                onClick={() => setReason(r.key)}
                className={`w-full text-left flex items-center gap-4 px-4 py-4 cursor-pointer transition-colors duration-150 ${
                  checked ? 'bg-[#3C3C3C]' : 'hover:bg-[#2e2e2c]'
                }`}
              >
                <RadioDot checked={checked} />
                <span className={'flex-1 min-w-0 text-xs1 leading-snug text-white'}>{r.label}</span>
              </button>
            </div>
          )
        })}
      </div>

      <div className={`mt-2.5 ${CARD} px-4 py-4`}>
        <p className={'pb-2.5 text-xss text-[#A0A0A0]'}>{'Zanechat vzkaz (nepovinné)'}</p>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          maxLength={COMMENT_MAX}
          disabled={sending}
          aria-label={'Vzkaz'}
          className={
            'bg-[#161615] mb-4 border block w-full border-[#4A4A4A] rounded-special-small text-book text-white h-[90px] resize-none p-3.5 focus:border-[#929292] outline-none'
          }
        />
        {error && <p className={'text-[#E71E6E] text-xss mb-4 text-center'}>{error}</p>}
        <button
          type={'button'}
          onClick={submit}
          disabled={disabled}
          className={`${PRIMARY_BTN} ${disabled ? PRIMARY_OFF : PRIMARY_ON}`}
        >
          {sending ? 'Odesílám…' : 'Odeslat'}
        </button>
      </div>
    </>
  )
}

interface Props {
  token: string
  origin: string | null
  initialInfo: IUnsubscribeInfo
}

export const UnsubscribeClient = ({ token, origin, initialInfo }: Props) => {
  const [info, setInfo] = useState<IUnsubscribeInfo>(initialInfo)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [justBack, setJustBack] = useState(false)

  // Смена статуса меняет высоту страницы: «vrátit zpět» стоит под опросом, и на телефоне
  // после нажатия всё сжималось, а экран оставался внизу (пусто + баннер ваучера).
  // Поэтому после смены — к началу блока. Первый рендер не трогаем.
  const topRef = useRef<HTMLDivElement>(null)
  const firstRender = useRef(true)
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      return
    }
    const el = topRef.current
    if (el && el.getBoundingClientRect().top < 0)
      el.scrollIntoView({ block: 'start', behavior: 'smooth' })
  }, [info.optedOut])

  const run = async (action: 'unsubscribe' | 'resubscribe') => {
    if (busy) return
    setBusy(true)
    setError('')
    try {
      const next = await postUnsubscribe(token, action, origin)
      setInfo(next)
      setJustBack(action === 'resubscribe')
    } catch {
      setError(ERROR_TEXT)
    } finally {
      setBusy(false)
    }
  }

  if (info.optedOut) {
    return (
      <div ref={topRef} className={'scroll-mt-[96px]'}>
        <StatusBox>
          <p className={'text-white text-resMd1 mb-1'}>{'Hotovo, odhlásili jsme vás'}</p>
          <p className={'text-[#A0A0A0] text-xss'}>
            {`Na adresu ${info.email} vám už nebudeme posílat připomenutí, prosby o recenzi ani nabídky. `}
            {'Potvrzení a připomenutí vašich rezervací vám chodit budou dál.'}
          </p>
        </StatusBox>
        <Survey token={token} />
        {error && <p className={'text-[#E71E6E] text-xss mt-4 text-center'}>{error}</p>}
        <div className={'mt-5 text-center'}>
          <button
            type={'button'}
            onClick={() => run('resubscribe')}
            disabled={busy}
            className={'text-[#A0A0A0] text-xss underline hover:text-white disabled:opacity-50'}
          >
            {busy ? '…' : 'Odhlásil(a) jsem se omylem — vrátit zpět'}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div ref={topRef} className={'scroll-mt-[96px]'}>
      <StatusBox>
        {justBack ? (
          <>
            <p className={'text-white text-resMd1 mb-1'}>{'Jste zpět, děkujeme! 💕'}</p>
            <p className={'text-[#A0A0A0] text-xss mb-5'}>
              {`Na adresu ${info.email} vám budeme `}
              <span className={'whitespace-nowrap'}>{'e-maily'}</span>
              {' posílat jako dřív.'}
            </p>
            <a className={`inline-block px-8 ${PRIMARY_BTN} ${PRIMARY_ON}`} href={'/book'}>
              {'Rezervovat termín'}
            </a>
          </>
        ) : (
          <>
            <p className={'text-white text-resMd1 mb-1'}>{'Nechcete od nás e-maily?'}</p>
            <p className={'text-[#A0A0A0] text-xss mb-5'}>
              {`Po odhlášení vám na adresu ${info.email} přestaneme posílat připomenutí další návštěvy, prosby o recenzi a nabídky. `}
              {'Potvrzení a připomenutí vašich rezervací vám chodit budou dál.'}
            </p>
            {error && <p className={'text-[#E71E6E] text-xss mb-4'}>{error}</p>}
            <div className={'flex flex-col items-center gap-3'}>
              <button
                type={'button'}
                onClick={() => run('unsubscribe')}
                disabled={busy}
                className={`max-w-[270px] ${PRIMARY_BTN} ${busy ? 'bg-[#5a5a5a] cursor-progress' : PRIMARY_ON}`}
              >
                {busy ? 'Odhlašuji…' : 'Odhlásit se'}
              </button>
              <a className={'text-[#A0A0A0] text-xss underline hover:text-white'} href={'/book'}>
                {'Ne, chci si rezervovat termín'}
              </a>
            </div>
          </>
        )}
      </StatusBox>
    </div>
  )
}
