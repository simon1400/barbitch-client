'use client'

import type { ICabinetBooking, ICabinetBookings } from '../fetch/cabinetApi'

import { RescheduleCalendar } from 'components/booking/RescheduleCalendar'
import { useCallback, useState } from 'react'

import {
  cabinetErrorCode,
  deleteCabinetRedemption,
  getCabinetBookingAvailability,
  postCabinetCancel,
  postCabinetReschedule,
} from '../fetch/cabinetApi'

import { Box, fmtDay, ghostBtnCls, SectionTitle } from './shared'

// Сколько записей истории показываем свёрнуто (остальное — под «Zobrazit vše»)
const HISTORY_PREVIEW = 5

const serviceTitle = (b: ICabinetBooking): string =>
  (b.services ?? [])
    .map((s) => s?.title)
    .filter(Boolean)
    .join(', ')

// Компактная дата истории: «24. 6. 2026» из YYYY-MM-DD
const fmtHistoryDate = (iso: string | null): string => {
  if (!iso) return '—'
  const [y, m, d] = iso.split('-')
  return `${Number(d)}. ${Number(m)}. ${y}`
}

// Статус-чип: точка + подпись, цвет по исходу визита
const STATUS_META: Record<string, { label: string; color: string }> = {
  active: { label: 'Aktivní', color: '#4ade80' },
  checkedOut: { label: 'Proběhla', color: '#4ade80' },
  cancelled: { label: 'Zrušena', color: '#E71E6E' },
  noshow: { label: 'Nedostavila se', color: '#f59e0b' },
}

const StatusChip = ({ status }: { status: ICabinetBooking['status'] }) => {
  const meta = STATUS_META[status] ?? { label: status, color: '#A0A0A0' }
  return (
    <span
      className={'inline-flex items-center gap-1.5 text-xss whitespace-nowrap'}
      style={{ color: meta.color }}
    >
      <span
        className={'w-1.5 h-1.5 rounded-full shrink-0'}
        style={{ backgroundColor: meta.color }}
      />
      {meta.label}
    </span>
  )
}

// Цена брони: со скидкой — исходная зачёркнута, итоговая рядом; иначе просто итог.
const PriceValue = ({ booking }: { booking: ICabinetBooking }) => {
  if (booking.totalPrice == null) return null
  const d = booking.discount
  if (d && d.discountKc > 0) {
    return (
      <>
        <span className={'line-through text-[#6b6b6b] font-normal mr-1.5'}>
          {`${booking.totalPrice + d.discountKc} Kč`}
        </span>
        {`${booking.totalPrice} Kč`}
      </>
    )
  }
  return <>{`${booking.totalPrice} Kč`}</>
}

const TrashIcon = () => (
  <svg
    width={'15'}
    height={'15'}
    viewBox={'0 0 24 24'}
    fill={'none'}
    stroke={'currentColor'}
    strokeWidth={'2'}
    strokeLinecap={'round'}
    strokeLinejoin={'round'}
    aria-hidden={'true'}
  >
    <path d={'M3 6h18'} />
    <path d={'M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2'} />
    <path d={'M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6'} />
    <line x1={'10'} y1={'11'} x2={'10'} y2={'17'} />
    <line x1={'14'} y1={'11'} x2={'14'} y2={'17'} />
  </svg>
)

// Блок применённой скидки bitchcard: зелёный бейдж со скидкой + иконка-корзина
// внутри для снятия (инлайн-подтверждение). Только у активной брони со скидкой.
const DiscountBlock = ({
  booking,
  confirming,
  busy,
  error,
  onReleaseClick,
  onConfirmRelease,
  onAbortRelease,
}: {
  booking: ICabinetBooking
  confirming: boolean
  busy: boolean
  error: string
  onReleaseClick: () => void
  onConfirmRelease: () => void
  onAbortRelease: () => void
}) => {
  const d = booking.discount
  if (!d || d.discountKc <= 0) return null
  if (confirming) {
    return (
      <div className={'mt-2 bg-[#161615] rounded-special-small p-3'}>
        <p className={'text-[#A0A0A0] text-xss mb-2.5'}>
          {'Zrušit slevu? Vrátí se zpět do věrnostního programu a půjde použít jindy.'}
        </p>
        {error && <p className={'text-[#E71E6E] text-xss mb-2.5'}>{error}</p>}
        <div className={'flex flex-wrap gap-2'}>
          <button
            type={'button'}
            disabled={busy}
            onClick={onConfirmRelease}
            className={`transition-colors duration-150 text-white font-semibold text-xss px-5 py-2.5 rounded-special-small ${
              busy ? 'bg-[#5a5a5a] cursor-progress' : 'bg-[#E71E6E] hover:bg-[#c9195f]'
            }`}
          >
            {busy ? 'Ruším…' : 'Zrušit slevu'}
          </button>
          <button
            type={'button'}
            disabled={busy}
            onClick={onAbortRelease}
            className={
              'border border-[#3C3C3C] text-[#A0A0A0] text-xss px-5 py-2.5 rounded-special-small hover:text-white'
            }
          >
            {'Zpět'}
          </button>
        </div>
      </div>
    )
  }
  return (
    <div
      className={
        'mt-2 inline-flex items-stretch bg-[#1f3527] border border-[#2f6b3f] rounded-special-small text-xss'
      }
    >
      <span className={'text-[#4ade80] px-3 py-1.5'}>
        <span className={'font-semibold'}>{`✦ Sleva bitchcard −${d.discountKc} Kč`}</span>
        {d.rewardTitle ? <span className={'text-[#7fbf95]'}>{` · ${d.rewardTitle}`}</span> : null}
      </span>
      {booking.canCancel && (
        <button
          type={'button'}
          onClick={onReleaseClick}
          title={'Zrušit slevu'}
          aria-label={'Zrušit slevu'}
          className={
            'shrink-0 flex items-center px-2.5 border-l border-[#2f6b3f] text-[#9aa39d] hover:text-[#E71E6E] hover:bg-[#161615] transition-colors'
          }
        >
          <TrashIcon />
        </button>
      )}
    </div>
  )
}

// Стрелка-шаг между карточками (последовательность броней)
const StepArrow = () => (
  <div className={'flex justify-center pt-2 pb-4 text-[#5a5a5a]'}>
    <svg
      width={'18'}
      height={'18'}
      viewBox={'0 0 24 24'}
      fill={'none'}
      stroke={'currentColor'}
      strokeWidth={'2'}
      strokeLinecap={'round'}
      strokeLinejoin={'round'}
      aria-hidden={'true'}
    >
      <path d={'M12 5v14'} />
      <path d={'m19 12-7 7-7-7'} />
    </svg>
  </div>
)

const BookingCard = ({
  booking,
  nearest,
  step,
  confirming,
  submitting,
  error,
  releaseConfirming,
  releasing,
  releaseError,
  onCancelClick,
  onConfirmCancel,
  onAbortCancel,
  onReschedule,
  onReleaseClick,
  onConfirmRelease,
  onAbortRelease,
}: {
  booking: ICabinetBooking
  nearest?: boolean
  step?: number | null
  confirming: boolean
  submitting: boolean
  error: string
  releaseConfirming: boolean
  releasing: boolean
  releaseError: string
  onCancelClick: () => void
  onConfirmCancel: () => void
  onAbortCancel: () => void
  onReschedule: () => void
  onReleaseClick: () => void
  onConfirmRelease: () => void
  onAbortRelease: () => void
}) => (
  <div
    className={`relative bg-[#252523] rounded-special-small px-5 pb-4 ${
      step != null ? 'pt-5' : 'pt-4'
    }`}
  >
    {step != null && (
      <span
        className={`absolute -top-2.5 left-4 z-10 inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide rounded-full pl-1 pr-2.5 py-0.5 shadow-md ${
          nearest ? 'bg-primary text-white' : 'bg-[#3a3a38] text-[#d5d5d5]'
        }`}
      >
        <span
          className={`w-4 h-4 rounded-full flex items-center justify-center li text-[10px]/9 ${
            nearest ? 'bg-white text-primary' : 'bg-[#5a5a58] text-white'
          }`}
        >
          {step}
        </span>
        {fmtDay(booking.date)}
      </span>
    )}
    {/* Kdy — datum + čas (čas jako akcent vpravo) */}
    <div className={'flex items-baseline justify-between gap-3'}>
      {/* <p className={'text-white text-xs1 font-semibold'}>{fmtDay(booking.date)}</p> */}
      {booking.time && (
        <span className={'text-primary text-xs1 font-bold whitespace-nowrap'}>{booking.time}</span>
      )}
    </div>
    {/* Co — služba, hlavní řádek karty */}
    <p className={'text-white text-xs1 leading-snug mt-2.5'}>
      {serviceTitle(booking) || 'Rezervace'}
    </p>
    {/* Kdo + kolik — mistrová vlevo, cena vpravo */}
    {(booking.employeeName || booking.totalPrice != null) && (
      <div className={'flex items-center justify-between gap-3 mt-1.5'}>
        <span className={'text-[#A0A0A0] text-xss'}>{booking.employeeName ?? ''}</span>
        <span className={'text-white text-xss whitespace-nowrap'}>
          <PriceValue booking={booking} />
        </span>
      </div>
    )}
    <DiscountBlock
      booking={booking}
      confirming={releaseConfirming}
      busy={releasing}
      error={releaseError}
      onReleaseClick={onReleaseClick}
      onConfirmRelease={onConfirmRelease}
      onAbortRelease={onAbortRelease}
    />
    {confirming ? (
      <div className={'mt-4 text-center'}>
        <p className={'text-[#A0A0A0] text-xss mb-3'}>{'Opravdu chcete tuto rezervaci zrušit?'}</p>
        {error && <p className={'text-[#E71E6E] text-xss mb-3'}>{error}</p>}
        <div className={'flex flex-col items-center gap-2.5'}>
          <button
            type={'button'}
            onClick={onConfirmCancel}
            disabled={submitting}
            className={`w-full max-w-[270px] transition-colors duration-150 text-white font-semibold text-xs1 py-3 rounded-special-small ${
              submitting ? 'bg-[#5a5a5a] cursor-progress' : 'bg-[#E71E6E] hover:bg-[#c9195f]'
            }`}
          >
            {submitting ? 'Ruším…' : 'Zrušit rezervaci'}
          </button>
          <button
            type={'button'}
            onClick={onAbortCancel}
            disabled={submitting}
            className={ghostBtnCls}
          >
            {'Zpět'}
          </button>
        </div>
      </div>
    ) : (
      <div className={'flex flex-wrap gap-2.5 mt-3.5'}>
        {booking.canReschedule && (
          <button
            type={'button'}
            onClick={onReschedule}
            className={
              'bg-primary hover:bg-[#c9195f] transition-colors duration-150 text-white font-semibold text-xss px-5 py-2.5 rounded-special-small'
            }
          >
            {'Změnit termín'}
          </button>
        )}
        {booking.canCancel && (
          <button
            type={'button'}
            onClick={onCancelClick}
            className={
              'border border-[#E71E6E] text-[#E71E6E] font-semibold text-xss px-5 py-2.5 rounded-special-small hover:bg-[#E71E6E14]'
            }
          >
            {'Zrušit'}
          </button>
        )}
      </div>
    )}
  </div>
)

// Строка истории: дата + статус-чип сверху, услуга отдельной приглушённой
// строкой ниже — так дату и исход визита легко сканировать по краям.
const HistoryRow = ({ booking }: { booking: ICabinetBooking }) => (
  <li className={'py-3 border-b border-[#3C3C3C] last:border-0'}>
    <div className={'flex items-center justify-between gap-3'}>
      <span className={'text-white text-xss font-semibold whitespace-nowrap'}>
        {fmtHistoryDate(booking.date)}
      </span>
      <StatusChip status={booking.status} />
    </div>
    <p className={'text-[#cbcbcb] text-xss font-medium leading-snug mt-1'}>
      {serviceTitle(booking) || 'Rezervace'}
    </p>
  </li>
)

const History = ({ history }: { history: ICabinetBooking[] }) => {
  const [showAll, setShowAll] = useState(false)
  const visible = showAll ? history : history.slice(0, HISTORY_PREVIEW)
  const hidden = history.length - visible.length
  return (
    <>
      <SectionTitle>{'Historie návštěv'}</SectionTitle>
      <div className={'bg-[#252523] rounded-special-small px-5 py-1'}>
        <ul>
          {visible.map((b) => (
            <HistoryRow key={b.documentId} booking={b} />
          ))}
        </ul>
      </div>
      {hidden > 0 && (
        <button
          type={'button'}
          onClick={() => setShowAll(true)}
          className={`${ghostBtnCls} mt-2.5`}
        >
          {`Zobrazit celou historii (${history.length})`}
        </button>
      )}
    </>
  )
}

interface Props {
  bookings: ICabinetBookings
  salonPhone: string
  onChanged: () => void
}

// Секция «Moje rezervace»: upcoming с действиями Zrušit / Změnit termín
// (флаги canCancel/canReschedule с сервера; правила 3ч/лимит — серверные,
// движок вернёт too_late/reschedule_limit) + historie.
export const BookingsSection = ({ bookings, salonPhone, onChanged }: Props) => {
  const [rescheduleId, setRescheduleId] = useState<string | null>(null)
  const [confirmId, setConfirmId] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [actionError, setActionError] = useState('')
  const [flash, setFlash] = useState('')
  // снятие применённой скидки
  const [releaseId, setReleaseId] = useState<string | null>(null)
  const [releasing, setReleasing] = useState(false)
  const [releaseError, setReleaseError] = useState('')

  const cancelErrorMessage = (code: string): string => {
    if (code === 'too_late') {
      const phone = salonPhone ? `: ${salonPhone}` : '.'
      return `Rezervaci lze zrušit nejpozději 3 hodiny předem. Zavolejte prosím do salonu${phone}`
    }
    if (code === 'not_active') return 'Rezervace už není aktivní.'
    return 'Zrušení se nepodařilo. Zkuste to prosím znovu.'
  }

  const handleConfirmCancel = async () => {
    if (!confirmId || submitting) return
    setSubmitting(true)
    setActionError('')
    try {
      await postCabinetCancel(confirmId)
      setConfirmId(null)
      setFlash('Rezervace byla zrušena.')
      onChanged()
    } catch (err) {
      setActionError(cancelErrorMessage(cabinetErrorCode(err)))
    } finally {
      setSubmitting(false)
    }
  }

  const releaseErrorMessage = (code: string): string => {
    if (code === 'booking_not_active') return 'Slevu lze zrušit jen u aktivní rezervace.'
    return 'Zrušení slevy se nepodařilo. Zkuste to prosím znovu.'
  }

  const handleConfirmRelease = async () => {
    if (!releaseId || releasing) return
    setReleasing(true)
    setReleaseError('')
    try {
      await deleteCabinetRedemption(releaseId)
      setReleaseId(null)
      setFlash('Sleva byla zrušena a vrátila se do věrnostního programu.')
      onChanged()
    } catch (err) {
      setReleaseError(releaseErrorMessage(cabinetErrorCode(err)))
    } finally {
      setReleasing(false)
    }
  }

  const fetchAvailability = useCallback(
    (from: string, to: string) => getCabinetBookingAvailability(rescheduleId as string, from, to),
    [rescheduleId],
  )
  const submitReschedule = useCallback(
    (body: { date: string; time: string }) => postCabinetReschedule(rescheduleId as string, body),
    [rescheduleId],
  )

  const startCancel = (id: string) => {
    setFlash('')
    setActionError('')
    setReleaseId(null)
    setConfirmId(id)
  }

  const startReschedule = (id: string) => {
    setFlash('')
    setRescheduleId(id)
  }

  const startRelease = (id: string) => {
    setFlash('')
    setReleaseError('')
    setConfirmId(null)
    setReleaseId(id)
  }

  const renderCard = (b: ICabinetBooking, nearest: boolean, step: number | null) => (
    <BookingCard
      key={b.documentId}
      booking={b}
      nearest={nearest}
      step={step}
      confirming={confirmId === b.documentId}
      submitting={submitting}
      error={actionError}
      releaseConfirming={releaseId === b.documentId}
      releasing={releasing}
      releaseError={releaseError}
      onCancelClick={() => startCancel(b.documentId)}
      onConfirmCancel={handleConfirmCancel}
      onAbortCancel={() => setConfirmId(null)}
      onReschedule={() => startReschedule(b.documentId)}
      onReleaseClick={() => startRelease(b.documentId)}
      onConfirmRelease={handleConfirmRelease}
      onAbortRelease={() => setReleaseId(null)}
    />
  )

  const rescheduleBooking = rescheduleId
    ? bookings.upcoming.find((b) => b.documentId === rescheduleId)
    : null

  if (rescheduleBooking) {
    return (
      <section>
        <SectionTitle>{'Moje rezervace'}</SectionTitle>
        <p className={'text-[#A0A0A0] text-xss mb-3'}>
          {`${serviceTitle(rescheduleBooking) || 'Rezervace'} · ${fmtDay(rescheduleBooking.date)}${
            rescheduleBooking.time ? ` v ${rescheduleBooking.time}` : ''
          }`}
        </p>
        <RescheduleCalendar
          fetchAvailability={fetchAvailability}
          submitReschedule={submitReschedule}
          onBack={() => setRescheduleId(null)}
          onDone={() => {
            setRescheduleId(null)
            setFlash('Termín byl změněn. Potvrzení jsme poslali e-mailem.')
            onChanged()
          }}
        />
      </section>
    )
  }

  return (
    <section>
      <SectionTitle>{'Moje rezervace'}</SectionTitle>
      {flash && (
        <div
          className={
            'bg-[#1f3527] border border-[#2f6b3f] rounded-special-small px-5 py-3.5 text-center mb-4'
          }
        >
          <p className={'text-[#4ade80] text-xss'}>{`✓ ${flash}`}</p>
        </div>
      )}
      {bookings.upcoming.length === 0 ? (
        <Box>
          <p className={'text-[#A0A0A0] text-xss mb-4'}>{'Nemáte žádné nadcházející rezervace.'}</p>
          <a
            className={
              'inline-block bg-primary text-white text-xs1 font-bold rounded-special-small px-6 py-3'
            }
            href={'/book'}
          >
            {'Rezervovat termín'}
          </a>
        </Box>
      ) : bookings.upcoming.length === 1 ? (
        renderCard(bookings.upcoming[0], false, null)
      ) : (
        // Několik termínů → kroky se šipkami (nejbližší nahoře), karty na plnou šířku
        <div className={'pt-4'}>
          {bookings.upcoming.map((b, idx) => (
            <div key={b.documentId}>
              {idx > 0 && <StepArrow />}
              {renderCard(b, idx === 0, idx + 1)}
            </div>
          ))}
        </div>
      )}
      {bookings.history.length > 0 && <History history={bookings.history} />}
    </section>
  )
}
