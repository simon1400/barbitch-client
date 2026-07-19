'use client'
import type { IRebookCreated, IRebookOffer, IRebookOffers } from '../book/fetch/engine'

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
  // созданные дозаписи — чтобы после reload показать «Dozápis potvrzen», а не офферы
  rebooks?: IRebookCreated[]
}

// бейдж времени показываем до часа после брони, предложения запрашиваем до 20 минут
const STORED_BADGE_TTL_MS = 60 * 60 * 1000
const STORED_OFFERS_TTL_MS = 20 * 60 * 1000

// Дозаписи дописываются в тот же sessionStorage-объект — переживают reload
const persistRebooks = (rebooks: IRebookCreated[]) => {
  try {
    const raw = sessionStorage.getItem(THANK_YOU_STORAGE_KEY)
    if (!raw) return
    sessionStorage.setItem(
      THANK_YOU_STORAGE_KEY,
      JSON.stringify({ ...(JSON.parse(raw) as StoredBooking), rebooks }),
    )
  } catch {
    // sessionStorage недоступен — после reload бейдж дозаписи просто не покажется
  }
}

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

// «neděle 19. 7.» — чешский день недели + число/месяц (дата брони «YYYY-MM-DD»).
// Парсим по частям (без Date-парсинга ISO — избегаем TZ-сдвига дня недели).
const fmtDateLabel = (isoDate: string | null): string | null => {
  if (!isoDate) return null
  const parts = isoDate.split('-')
  const y = Number(parts[0])
  const m = Number(parts[1])
  const d = Number(parts[2])
  if (!y || !m || !d) return null
  const weekday = new Intl.DateTimeFormat('cs-CZ', { weekday: 'long' }).format(
    new Date(y, m - 1, d),
  )
  return `${weekday} ${d}. ${m}.`
}

// Полупрозрачная плашка-подтверждение (пилюля ✓ + текст) — используется и для
// исходной брони (верхний бейдж), и для подтверждения дозаписи
const Badge = ({ text }: { text: string }) => (
  <div className={'flex justify-center'}>
    <div
      className={
        'inline-flex items-center gap-2.5 sm:gap-3 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2.5 sm:px-6 sm:py-3'
      }
    >
      <span
        className={
          'flex items-center justify-center w-6 h-6 rounded-full bg-white text-primary text-xss shrink-0'
        }
      >
        {'✓'}
      </span>
      <span className={'text-white text-xss sm:text-sm'}>{text}</span>
    </div>
  </div>
)

const ConfirmBadge = ({ time, dateLabel }: { time: string | null; dateLabel: string | null }) => {
  const datePart = dateLabel ? `${dateLabel} · ` : ''
  const label = time
    ? `Rezervace potvrzena · ${datePart}čekáme vás v ${time}`
    : 'Rezervace potvrzena'
  return <Badge text={label} />
}

// Декоративное сердце-вотермарка на розовом фоне (за контентом)
const HeartBg = () => (
  <div
    aria-hidden
    className={
      'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[660px] max-w-[92vw] -z-10 pointer-events-none'
    }
  >
    <img src={'/assets/icons/heart.svg'} alt={''} className={'w-full h-auto'} />
  </div>
)

const CountdownPill = ({ percent, leftMs }: { percent: number; leftMs: number }) => (
  <div className={'flex justify-center'}>
    <div
      className={
        'inline-flex items-center gap-2 sm:gap-3 bg-accent rounded-special-small px-4 py-2.5 sm:px-6 sm:py-3'
      }
    >
      <span className={'text-primary text-resLg sm:text-h5'}>{`−${percent} %`}</span>
      <span className={'text-[#A0A0A0] text-xss sm:text-xs1'}>{'platí ještě'}</span>
      <span className={'text-white text-resLg sm:text-h5 tabular-nums'}>
        {fmtCountdown(leftMs)}
      </span>
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
    <div className={'bg-accent rounded-special p-4 sm:p-6 text-left flex flex-col min-w-0'}>
      <div className={'flex items-start gap-3 sm:gap-4 mb-5'}>
        <MasterPhoto offer={offer} />
        <div className={'flex-1 min-w-0'}>
          <p className={'text-white text-resMd1 sm:text-h5 truncate'}>{offer.employeeName}</p>
          <p className={'text-[#A0A0A0] text-xss sm:text-xs1'}>
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

      <div className={'bg-[#252523] rounded-special-small px-4 py-3 flex gap-5 sm:gap-8 mb-5'}>
        <div className={'min-w-0'}>
          <p className={'text-[#A0A0A0] text-resXxs uppercase tracking-widest mb-1'}>{'Začátek'}</p>
          <p className={'text-white text-xs'}>{`${offer.startTime} · hned po vás`}</p>
        </div>
        <div className={'min-w-0'}>
          <p className={'text-[#A0A0A0] text-resXxs uppercase tracking-widest mb-1'}>{'Trvání'}</p>
          <p className={'text-white text-xs'}>{`${selected.durationMin} min`}</p>
        </div>
      </div>

      <div className={'mt-auto flex flex-wrap items-center justify-between gap-3'}>
        <p className={'whitespace-nowrap'}>
          <span className={'text-[#A0A0A0] text-xs1 line-through mr-2'}>
            {fmtPrice(selected.price)}
          </span>
          <span className={'text-primary text-resMd1 sm:text-h5'}>
            {fmtPrice(selected.discountedPrice)}
          </span>
        </p>
        <button
          type={'button'}
          disabled={busy}
          onClick={() => onBook(offer, selected.serviceDocId)}
          className={
            'bg-white text-accent text-xss rounded-special-small px-5 py-3 sm:py-3.5 hover:bg-gray-100 disabled:opacity-60 shrink-0'
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
      <span className={'font-bold'}>{created.serviceTitle}</span>
      {` v ${created.time} u ${created.employee.name} za ${fmtPrice(created.totalPrice)}. `}
      {'Potvrzení jsme poslali na e-mail.'}
    </p>
  </div>
)

// Чистая линейная стрелка (текстовый глиф «→» в Montserrat выглядит криво,
// плюс подчёркивание ссылки резало его хвост)
const ArrowRight = () => (
  <svg
    width={16}
    height={16}
    viewBox={'0 0 24 24'}
    fill={'none'}
    aria-hidden
    className={'shrink-0'}
  >
    <path
      d={'M5 12h13M12 6l6 6-6 6'}
      stroke={'currentColor'}
      strokeWidth={2}
      strokeLinecap={'round'}
      strokeLinejoin={'round'}
    />
  </svg>
)

const BottomLinks = () => (
  <div className={'text-center'}>
    <p className={'text-white text-baseSm mb-6'}>
      {'Spravujte rezervace a sbírejte nálepky '}
      <span className={'font-bold'}>{'bitchcard'}</span>
      {' — '}
      <a href={'/cabinet'} className={'font-bold inline-flex items-center gap-1.5 align-middle'}>
        <span className={'underline underline-offset-4'}>{'Můj účet'}</span>
        <ArrowRight />
      </a>
    </p>
    <a href={'/'} className={'text-white text-baseSm underline underline-offset-4'}>
      {'Zpět na úvod'}
    </a>
  </div>
)

// Fallback без предложений дозаписи (нет окна / таймер истёк) — минимальное
// подтверждение в том же дизайне: бейдж + короткий заголовок + нижние ссылки.
const PlainContent = ({ time, dateLabel }: { time: string | null; dateLabel: string | null }) => (
  <div className={'m-auto text-center relative'}>
    <HeartBg />
    <Container size={'lg'}>
      {time && (
        <div className={'mb-8 sm:mb-10'}>
          <ConfirmBadge time={time} dateLabel={dateLabel} />
        </div>
      )}
      <h1 className={'text-white text-resBig md:text-xxl mb-3'}>
        {'Vaše rezervace je potvrzena.'}
      </h1>
      <p className={'text-white text-baseSm md:text-baseText max-w-[560px] mx-auto mb-10 sm:mb-15'}>
        {'Těšíme se na vás v našem salonu!'}
      </p>
      <BottomLinks />
    </Container>
  </div>
)

// Экран после успешной дозаписи: только подтверждение созданной записи, без
// предложения следующих окон (pt-24 на мобиле — чтобы не заезжать под шапку).
const RebookDone = ({
  time,
  dateLabel,
  created,
}: {
  time: string | null
  dateLabel: string | null
  created: IRebookCreated[]
}) => (
  <div
    className={'flex-1 flex flex-col justify-start md:justify-center pt-24 md:pt-15 pb-10 md:pb-15'}
  >
    <Container size={'lg'}>
      <div className={'relative text-center'}>
        <HeartBg />
        <ConfirmBadge time={time} dateLabel={dateLabel} />
        <h1 className={'text-white text-resBig md:text-xxl mt-8 sm:mt-13 mb-8'}>
          {'Skvělé, těšíme se!'}
        </h1>
        <div className={'space-y-4 mb-10 sm:mb-15'}>
          {created.map((c) => {
            const cLabel = fmtDateLabel(c.date)
            const cDatePart = cLabel ? `${cLabel} · ` : ''
            return (
              <div key={c.bookingId} className={'space-y-3'}>
                <Badge text={`Dozápis potvrzen · ${cDatePart}v ${c.time}`} />
                <SuccessBanner created={c} />
              </div>
            )
          })}
        </div>
        <BottomLinks />
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
    // дозапись уже сделана → после reload сразу экран «Dozápis potvrzen»,
    // офферы не запрашиваем (сервер бы всё равно ответил already_rebooked)
    if (s?.rebooks?.length) {
      setCreated(s.rebooks)
      setLoading(false)
      return
    }
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
        const next = [...created, result]
        setCreated(next)
        persistRebooks(next)
        // после успешной дозаписи больше НЕ предлагаем следующие — показываем только
        // экран с оповещением о созданной записи (offers скрываем)
        setOffers(null)
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
    [stored, busy, created, loadOffers],
  )

  const time = offers?.anchor?.time ?? stored?.time ?? null
  const dateLabel = fmtDateLabel(offers?.anchor?.date ?? stored?.date ?? null)
  const showOffers =
    !loading && Boolean(offers?.available) && (offers?.offers.length ?? 0) > 0 && leftMs > 0
  // после успешной дозаписи — экран только с оповещением (приоритет над офферами)
  const showDone = created.length > 0

  const renderBody = () => {
    if (showDone) return <RebookDone time={time} dateLabel={dateLabel} created={created} />
    if (showOffers && offers) {
      return (
        <div
          className={
            'flex-1 flex flex-col justify-start md:justify-center pt-24 md:pt-15 pb-10 md:pb-15'
          }
        >
          <Container size={'lg'}>
            <div className={'text-center'}>
              <ConfirmBadge time={time} dateLabel={dateLabel} />

              <p
                className={'text-white/80 text-resXs uppercase tracking-[0.3em] mt-8 sm:mt-13 mb-4'}
              >
                {'Prodlužte si návštěvu'}
              </p>
              <h1 className={'text-white text-resBig md:text-xxl mb-6'}>
                {'Volné okénko hned po vás'}
              </h1>
              <p className={'text-white text-baseSm md:text-baseText max-w-[620px] mx-auto mb-8'}>
                {
                  'Mistryně vedle má volno přesně, když končíte. Žádné čekání — jen se přesunete o křeslo dál.'
                }
              </p>

              <CountdownPill percent={offers.discountPercent} leftMs={leftMs} />

              {rebookError && <p className={'text-white text-xss mt-6'}>{rebookError}</p>}

              <div
                className={`mt-8 sm:mt-10 grid gap-5 sm:gap-6 ${offers.offers.length > 1 ? 'md:grid-cols-2' : 'md:max-w-[560px] md:mx-auto'}`}
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

              <div className={'mt-10 sm:mt-15'}>
                <BottomLinks />
              </div>
            </div>
          </Container>
        </div>
      )
    }
    return (
      <div className={'flex-1 flex flex-col pt-24 md:pt-0'}>
        {!loading && <PlainContent time={time} dateLabel={dateLabel} />}
      </div>
    )
  }

  return (
    <main
      className={'min-h-screen flex flex-col overflow-x-hidden'}
      style={{
        backgroundImage: 'linear-gradient(0deg, rgba(231,30,110,1) 0%, rgba(255,0,101,0.5) 100%)',
      }}
    >
      {renderBody()}
    </main>
  )
}

export default ThankYouClient
