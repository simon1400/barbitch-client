'use client'
import type { IRebookCreated, IRebookOffer, IRebookOffers } from '../book/fetch/engine'

import Button from 'components/Button'
import { Container } from 'components/Container'
import { useCallback, useEffect, useState } from 'react'

import {
  engineAssetUrl,
  engineErrorCode,
  getEngineRebookOffers,
  postEngineRebook,
  THANK_YOU_STORAGE_KEY,
} from '../book/fetch/engine'

// Thank-you страница: подтверждение брони + предложения дозаписи (rebook).
// Данные только что созданной брони приходят из sessionStorage (кладёт BookForm),
// предложения — с движка по cancelToken. Без данных/предложений — обычный экран.

interface StoredBooking {
  cancelToken: string
  date: string
  time: string | null
  ts: number
}

// бейдж времени показываем до часа после брони, предложения запрашиваем до 20 минут
const STORED_BADGE_TTL_MS = 60 * 60 * 1000
const STORED_OFFERS_TTL_MS = 20 * 60 * 1000

const readStored = (): StoredBooking | null => {
  try {
    const raw = sessionStorage.getItem(THANK_YOU_STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as StoredBooking
    if (!parsed?.cancelToken || !parsed?.ts) return null
    if (Date.now() - parsed.ts > STORED_BADGE_TTL_MS) return null
    return parsed
  } catch {
    return null
  }
}

// «1 190 Kč» — тысячи неразрывным пробелом, без regex (sonarjs slow-regex)
const NBSP = String.fromCharCode(160)

const fmtPrice = (n: number): string => {
  const s = String(Math.round(n))
  let out = ''
  for (let i = 0; i < s.length; i++) {
    out += s[i]
    const fromEnd = s.length - 1 - i
    if (fromEnd > 0 && fromEnd % 3 === 0) out += NBSP
  }
  return `${out}${NBSP}Kč`
}

const fmtCountdown = (ms: number): string => {
  const total = Math.max(0, Math.floor(ms / 1000))
  const m = Math.floor(total / 60)
  const s = total % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

const ConfirmBadge = ({ time }: { time: string | null }) => (
  <div className={'flex justify-center'}>
    <div className={'inline-flex items-center gap-3 bg-accent rounded-full px-6 py-3'}>
      <span
        className={
          'flex items-center justify-center w-6 h-6 rounded-full bg-white text-primary text-xss'
        }
      >
        {'✓'}
      </span>
      <span className={'text-white text-xss sm:text-sm'}>
        {time ? `Rezervace potvrzena · čekáme vás v ${time}` : 'Rezervace potvrzena'}
      </span>
    </div>
  </div>
)

const CountdownPill = ({ percent, leftMs }: { percent: number; leftMs: number }) => (
  <div className={'flex justify-center'}>
    <div className={'inline-flex items-center gap-3 bg-accent rounded-special-small px-6 py-3'}>
      <span className={'text-primary text-h5'}>{`−${percent} %`}</span>
      <span className={'text-[#A0A0A0] text-xs1'}>{'platí ještě'}</span>
      <span className={'text-white text-h5 tabular-nums'}>{fmtCountdown(leftMs)}</span>
    </div>
  </div>
)

const MasterPhoto = ({ offer }: { offer: IRebookOffer }) => {
  const url = engineAssetUrl(offer.photoUrl)
  if (url) {
    return (
      <img
        src={url}
        alt={offer.employeeName}
        className={'w-14 h-14 rounded-rounded object-cover shrink-0'}
      />
    )
  }
  return (
    <span
      className={
        'flex items-center justify-center w-14 h-14 rounded-rounded bg-[#252523] text-[#A0A0A0] text-h5 shrink-0'
      }
    >
      {offer.employeeName.slice(0, 1).toUpperCase()}
    </span>
  )
}

interface OfferCardProps {
  offer: IRebookOffer
  discountPercent: number
  busy: boolean
  onBook: (offer: IRebookOffer, serviceDocId: string) => void
}

const OfferCard = ({ offer, discountPercent, busy, onBook }: OfferCardProps) => {
  const [selectedId, setSelectedId] = useState(offer.services[0]?.serviceDocId ?? '')
  const selected = offer.services.find((s) => s.serviceDocId === selectedId) ?? offer.services[0]
  if (!selected) return null

  return (
    <div className={'bg-accent rounded-special p-5 sm:p-6 text-left flex flex-col'}>
      <div className={'flex items-start gap-4 mb-5'}>
        <MasterPhoto offer={offer} />
        <div className={'flex-1 min-w-0'}>
          <p className={'text-white text-h5 truncate'}>{offer.employeeName}</p>
          <p className={'text-[#A0A0A0] text-xs1'}>
            {offer.specialist}
            {' · vedlejší křeslo'}
          </p>
        </div>
        <span
          className={'bg-primary text-white text-xss rounded-special-small px-2.5 py-1 shrink-0'}
        >
          {`−${discountPercent} %`}
        </span>
      </div>

      <p className={'text-[#A0A0A0] text-resXs uppercase tracking-widest mb-3'}>
        {'Vyberte službu'}
      </p>
      <div className={'flex flex-wrap gap-2 mb-4'}>
        {offer.services.map((s) => {
          const active = s.serviceDocId === selected.serviceDocId
          return (
            <button
              key={s.serviceDocId}
              type={'button'}
              onClick={() => setSelectedId(s.serviceDocId)}
              className={`rounded-special-small px-3.5 py-2 text-xss transition-colors ${
                active
                  ? 'bg-primary text-white'
                  : 'bg-white text-accent border border-gray-200 hover:border-primary'
              }`}
            >
              {s.title}
            </button>
          )
        })}
      </div>

      <div className={'bg-[#252523] rounded-special-small px-4 py-3 flex gap-8 mb-5'}>
        <div>
          <p className={'text-[#A0A0A0] text-resXxs uppercase tracking-widest mb-1'}>{'Začátek'}</p>
          <p className={'text-white text-xs'}>{`${offer.startTime} · hned po vás`}</p>
        </div>
        <div>
          <p className={'text-[#A0A0A0] text-resXxs uppercase tracking-widest mb-1'}>{'Trvání'}</p>
          <p className={'text-white text-xs'}>{`${selected.durationMin} min`}</p>
        </div>
      </div>

      <div className={'mt-auto flex items-center justify-between gap-4'}>
        <p className={'whitespace-nowrap'}>
          <span className={'text-[#A0A0A0] text-xs1 line-through mr-2'}>
            {fmtPrice(selected.price)}
          </span>
          <span className={'text-primary text-h5'}>{fmtPrice(selected.discountedPrice)}</span>
        </p>
        <button
          type={'button'}
          disabled={busy}
          onClick={() => onBook(offer, selected.serviceDocId)}
          className={
            'bg-white text-accent text-xss rounded-special-small px-5 py-3.5 hover:bg-gray-100 disabled:opacity-60'
          }
        >
          {busy ? 'Rezervuji…' : 'Dorezervovat'}
        </button>
      </div>
    </div>
  )
}

const SuccessBanner = ({ created }: { created: IRebookCreated }) => (
  <div
    className={
      'mx-auto max-w-[560px] bg-accent rounded-special-small px-6 py-4 text-left flex items-start gap-3'
    }
  >
    <span
      className={
        'flex items-center justify-center w-6 h-6 rounded-full bg-primary text-white text-xss shrink-0 mt-0.5'
      }
    >
      {'✓'}
    </span>
    <p className={'text-white text-xss font-normal'}>
      {'Dozápis potvrzen — '}
      <span className={'font-bold'}>{created.serviceTitle}</span>
      {` v ${created.time} u ${created.employee.name} za ${fmtPrice(created.totalPrice)}. `}
      {'Potvrzení jsme poslali na e-mail.'}
    </p>
  </div>
)

const BottomLinks = () => (
  <div className={'text-center'}>
    <p className={'text-white text-baseSm mb-6'}>
      {'Spravujte rezervace a sbírejte nálepky '}
      <span className={'font-bold'}>{'bitchcard'}</span>
      {' — '}
      <a href={'/cabinet'} className={'font-bold underline underline-offset-4'}>
        {'Můj účet →'}
      </a>
    </p>
    <a href={'/'} className={'text-white text-baseSm underline underline-offset-4'}>
      {'Zpět na úvod'}
    </a>
  </div>
)

// Обычный экран (без данных брони / без предложений / после истечения таймера) —
// прежний дизайн thank-you.
const PlainContent = ({ time }: { time: string | null }) => (
  <div className={'m-auto text-center relative'}>
    <div
      className={
        'absolute top-[50%] left-[50%] -translate-y-1/2 -translate-x-1/2 w-[660px] h-[578px] -z-10'
      }
    >
      <img src={'/assets/icons/heart.svg'} alt={'Big pink heart icon'} />
    </div>
    <Container size={'lg'}>
      {time && (
        <div className={'mb-10'}>
          <ConfirmBadge time={time} />
        </div>
      )}
      <div className={'mb-17'}>
        <h1 className={'mb-10 text-resLg md:text-xxl'}>{'Vaše rezervace je potvrzena.'}</h1>
        <p className={'text-white text-baseSm md:text-baseText'}>
          {'Těšíme se na vás v našem salonu a slibujeme, že váš zážitek bude jedinečný!'}
        </p>
        <p className={'text-white text-baseSm md:text-baseText font-bold'}>
          {'Přiveďte kamarádku a získejte 10% slevu na další návštěvu!'}
        </p>
      </div>
      <div className={'mb-10 mx-auto max-w-[560px] bg-accent/80 rounded-special-small px-6 py-5'}>
        <p className={'text-white text-baseSm md:text-baseText font-bold mb-1'}>
          {'✦ Sledujte své rezervace a sbírejte nálepky ✦'}
        </p>
        <p className={'text-white text-baseSm mb-4'}>
          {
            'V klientském kabinetu spravujete své termíny a za každých 1 000 Kč získáte nálepku bitchcard — odměny až sleva 50 %.'
          }
        </p>
        <a
          href={'/cabinet'}
          className={
            'inline-block bg-white text-primary text-baseSm font-bold rounded-special-small px-6 py-3'
          }
        >
          {'Můj účet →'}
        </a>
      </div>
      <div>
        <Button text={'zpět na úvod'} href={'/'} />
      </div>
    </Container>
  </div>
)

const REBOOK_ERROR_MESSAGES: Record<string, string> = {
  slot_taken: 'Okénko už bohužel někdo obsadil. Zkuste jinou službu nebo mistrovou.',
  rebook_expired: 'Nabídka dozápisu už vypršela.',
}

const ThankYouClient = () => {
  const [stored, setStored] = useState<StoredBooking | null>(null)
  const [offers, setOffers] = useState<IRebookOffers | null>(null)
  const [loading, setLoading] = useState(true)
  const [leftMs, setLeftMs] = useState(0)
  const [busy, setBusy] = useState(false)
  const [created, setCreated] = useState<IRebookCreated[]>([])
  const [rebookError, setRebookError] = useState('')

  const loadOffers = useCallback(async (token: string) => {
    try {
      const data = await getEngineRebookOffers(token)
      setOffers(data)
      // таймер сразу в одном батче с offers — без кадра-вспышки обычного экрана
      setLeftMs(new Date(data.expiresAt).getTime() - Date.now())
    } catch {
      setOffers(null)
    }
  }, [])

  useEffect(() => {
    const s = readStored()
    setStored(s)
    if (!s || Date.now() - s.ts > STORED_OFFERS_TTL_MS) {
      setLoading(false)
      return
    }
    loadOffers(s.cancelToken).finally(() => setLoading(false))
  }, [loadOffers])

  // обратный отсчёт «platí ještě MM:SS» до expiresAt предложения
  useEffect(() => {
    if (!offers?.available) return
    const expiresMs = new Date(offers.expiresAt).getTime()
    const tick = () => setLeftMs(expiresMs - Date.now())
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [offers])

  const handleBook = useCallback(
    async (offer: IRebookOffer, serviceDocId: string) => {
      if (!stored || busy) return
      setBusy(true)
      setRebookError('')
      try {
        const result = await postEngineRebook(stored.cancelToken, {
          service: serviceDocId,
          employee: offer.employeeDocId,
        })
        setCreated((prev) => [...prev, result])
        // пере-запрос: категория дозаписи исключится, якорь сдвинется на её конец —
        // если есть ещё окно (третья категория), предложения продолжатся каскадом
        await loadOffers(stored.cancelToken)
      } catch (err) {
        const code = engineErrorCode(err)
        setRebookError(
          REBOOK_ERROR_MESSAGES[code] ?? 'Dozápis se nepodařil. Zkuste to prosím znovu.',
        )
        if (code === 'slot_taken') await loadOffers(stored.cancelToken)
        if (code === 'rebook_expired') setOffers(null)
      } finally {
        setBusy(false)
      }
    },
    [stored, busy, loadOffers],
  )

  const time = offers?.anchor?.time ?? stored?.time ?? null
  const showOffers =
    !loading && Boolean(offers?.available) && (offers?.offers.length ?? 0) > 0 && leftMs > 0

  return (
    <main
      className={'min-h-screen flex flex-col'}
      style={{
        backgroundImage: 'linear-gradient(0deg, rgba(231,30,110,1) 0%, rgba(255,0,101,0.5) 100%)',
      }}
    >
      {showOffers && offers ? (
        <div className={'flex-1 flex flex-col justify-center py-15'}>
          <Container size={'lg'}>
            <div className={'text-center'}>
              <ConfirmBadge time={time} />

              <p className={'text-white/80 text-resXs uppercase tracking-[0.3em] mt-13 mb-4'}>
                {'Prodlužte si návštěvu'}
              </p>
              <h1 className={'text-resBig md:text-xxl mb-6'}>{'Volné okénko hned po vás'}</h1>
              <p className={'text-white text-baseSm md:text-baseText max-w-[620px] mx-auto mb-8'}>
                {
                  'Mistryně vedle má volno přesně, když končíte. Žádné čekání — jen se přesunete o křeslo dál.'
                }
              </p>

              <CountdownPill percent={offers.discountPercent} leftMs={leftMs} />

              {created.length > 0 && (
                <div className={'mt-10 space-y-3'}>
                  {created.map((c) => (
                    <SuccessBanner key={c.bookingId} created={c} />
                  ))}
                </div>
              )}
              {rebookError && <p className={'text-white text-xss mt-6'}>{rebookError}</p>}

              <div
                className={`mt-10 grid gap-6 ${offers.offers.length > 1 ? 'md:grid-cols-2' : 'md:max-w-[560px] md:mx-auto'}`}
              >
                {offers.offers.map((o) => (
                  <OfferCard
                    key={o.employeeDocId}
                    offer={o}
                    discountPercent={offers.discountPercent}
                    busy={busy}
                    onBook={handleBook}
                  />
                ))}
              </div>

              <div className={'mt-15'}>
                <BottomLinks />
              </div>
            </div>
          </Container>
        </div>
      ) : (
        <div className={'flex-1 flex flex-col'}>
          {created.length > 0 && (
            <div className={'pt-15 space-y-3'}>
              <Container size={'lg'}>
                {created.map((c) => (
                  <SuccessBanner key={c.bookingId} created={c} />
                ))}
              </Container>
            </div>
          )}
          {!loading && <PlainContent time={time} />}
        </div>
      )}
    </main>
  )
}

export default ThankYouClient
