'use client'

import type { ICabinetBooking, ICabinetBookings } from '../fetch/cabinetApi'

import { RescheduleCalendar } from 'components/booking/RescheduleCalendar'
import { differenceInCalendarDays, format, parseISO } from 'date-fns'
import { cs } from 'date-fns/locale/cs'
import { useCallback, useState } from 'react'

import { selectionToQuery } from '../../book/fetch/engine'
import {
  cabinetErrorCode,
  deleteCabinetRedemption,
  getCabinetBookingAvailability,
  postCabinetCancel,
  postCabinetReschedule,
} from '../fetch/cabinetApi'

import { fmtDay, SectionTitle } from './shared'

// Чешские 3-буквенные сокращения месяцев (для боковой даты-плашки компактных карт)
const MONTHS_ABBR = [
  'LED',
  'ÚNO',
  'BŘE',
  'DUB',
  'KVĚ',
  'ČVN',
  'ČVC',
  'SRP',
  'ZÁŘ',
  'ŘÍJ',
  'LIS',
  'PRO',
]

const serviceTitle = (b: ICabinetBooking): string =>
  (b.services ?? [])
    .map((s) => s?.title)
    .filter(Boolean)
    .join(', ')

// «1 190 Kč» — тысячи через пробел (без regex — sonarjs slow-regex)
const fmtPrice = (n: number): string => {
  const digits = String(Math.round(Math.abs(n)))
  let grouped = ''
  for (let i = 0; i < digits.length; i += 1) {
    if (i > 0 && (digits.length - i) % 3 === 0) grouped += ' '
    grouped += digits[i]
  }
  return `${n < 0 ? '−' : ''}${grouped} Kč`
}

// Дата hero-карты двумя строками: «pátek» / «24. července»
const heroDate = (iso: string | null): { weekday: string; dayMonth: string } => {
  if (!iso) return { weekday: '', dayMonth: '' }
  try {
    const d = parseISO(iso)
    return {
      weekday: format(d, 'EEEE', { locale: cs }),
      dayMonth: format(d, 'd. MMMM', { locale: cs }),
    }
  } catch {
    return { weekday: '', dayMonth: iso }
  }
}

// «ZA 5 DNÍ» / «ZÍTRA» / «DNES» — до даты брони (чешская множественность)
const countdown = (iso: string | null): string => {
  if (!iso) return ''
  try {
    const diff = differenceInCalendarDays(parseISO(iso), new Date())
    if (diff < 0) return ''
    if (diff === 0) return 'DNES'
    if (diff === 1) return 'ZÍTRA'
    if (diff < 5) return `ZA ${diff} DNY`
    return `ZA ${diff} DNÍ`
  } catch {
    return ''
  }
}

// Боковая плашка компактной карты: «12» / «SRP»
const dateBox = (iso: string | null): { day: string; month: string } => {
  if (!iso) return { day: '', month: '' }
  try {
    // Локальные getDate/getMonth (НЕ getUTC*): parseISO плоской даты даёт локальную
    // полночь, и остальные форматтеры (weekdayOf/heroDate) тоже локальные — иначе в
    // TZ с положительным сдвигом число уезжало на день назад (баг «29» при středa 30.)
    const d = parseISO(iso)
    return { day: String(d.getDate()), month: MONTHS_ABBR[d.getMonth()] ?? '' }
  } catch {
    return { day: '', month: '' }
  }
}

const weekdayOf = (iso: string | null): string => {
  if (!iso) return ''
  try {
    return format(parseISO(iso), 'EEEE', { locale: cs })
  } catch {
    return ''
  }
}

// deep-link «Rezervovat znovu» по последнему снапшоту с serviceDocId
const buildRebook = (bookings: ICabinetBookings): { href: string; service: string } | null => {
  const source: ICabinetBooking[] = [...bookings.history, ...bookings.upcoming]
  const last = source.find((b) => b.services?.[0]?.serviceDocId)
  if (!last) return null
  const item = last.services[0]
  const href = `/book/${item.serviceDocId}${selectionToQuery({
    variant: item.variant ?? null,
    modifiers: item.modifiers ?? [],
  })}`
  return { href, service: item.title }
}

// Цена брони: со скидкой — исходная зачёркнута, итоговая рядом; иначе просто итог.
const PriceValue = ({ booking }: { booking: ICabinetBooking }) => {
  if (booking.totalPrice == null) return null
  const d = booking.discount
  if (d && d.discountKc > 0) {
    return (
      <>
        <span className={'line-through text-[#6b6b6b] font-normal mr-1.5'}>
          {fmtPrice(booking.totalPrice + d.discountKc)}
        </span>
        {fmtPrice(booking.totalPrice)}
      </>
    )
  }
  return <>{fmtPrice(booking.totalPrice)}</>
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

const ChevronIcon = ({ open }: { open: boolean }) => (
  <svg
    className={`shrink-0 text-[#8a8a8a] transition-transform duration-150 ${open ? 'rotate-90' : ''}`}
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
    <path d={'m9 18 6-6-6-6'} />
  </svg>
)

const CalendarIcon = () => (
  <svg
    width={'22'}
    height={'22'}
    viewBox={'0 0 24 24'}
    fill={'none'}
    stroke={'#E71E6E'}
    strokeWidth={'2'}
    strokeLinecap={'round'}
    strokeLinejoin={'round'}
    aria-hidden={'true'}
  >
    <rect x={'3'} y={'4'} width={'18'} height={'18'} rx={'2'} />
    <path d={'M16 2v4M8 2v4M3 10h18'} />
  </svg>
)

// ── общие действия карты ──

interface CardProps {
  booking: ICabinetBooking
  cancelConfirming: boolean
  cancelSubmitting: boolean
  cancelError: string
  cancelReason: string
  releaseConfirming: boolean
  releasing: boolean
  releaseError: string
  onCancelClick: () => void
  onCancelReasonChange: (value: string) => void
  onConfirmCancel: () => void
  onAbortCancel: () => void
  onReschedule: () => void
  onReleaseClick: () => void
  onConfirmRelease: () => void
  onAbortRelease: () => void
}

// Лейбл скидки по типу: bitchcard-награда либо скидка за дозапись (rebook)
const discountLabel = (discount: NonNullable<ICabinetBooking['discount']>): string =>
  discount.type === 'rebook'
    ? `✦ Sleva za dozápis −${fmtPrice(discount.discountKc)}`
    : `✦ Sleva bitchcard −${fmtPrice(discount.discountKc)}`

// Читабельный бейдж применённой скидки (в свёрнутой компактной карте — без корзины)
const DiscountBadgeReadonly = ({
  discount,
}: {
  discount: NonNullable<ICabinetBooking['discount']>
}) => (
  <span
    className={
      'inline-flex items-center bg-[#1f3527] border border-[#2f6b3f] rounded-special-small text-xss text-[#4ade80] px-3 py-1.5'
    }
  >
    <span className={'font-semibold'}>{discountLabel(discount)}</span>
    {discount.rewardTitle ? (
      <span className={'text-[#7fbf95]'}>{` · ${discount.rewardTitle}`}</span>
    ) : null}
  </span>
)

// Блок применённой скидки bitchcard: зелёный бейдж + иконка-корзина внутри для
// снятия (инлайн-подтверждение). Только у активной брони со скидкой.
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
      <div className={'mt-3 bg-[#161615] rounded-special-small p-3'}>
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
        'mt-3 inline-flex items-stretch bg-[#1f3527] border border-[#2f6b3f] rounded-special-small text-xss'
      }
    >
      <span className={'text-[#4ade80] px-3 py-1.5'}>
        <span className={'font-semibold'}>{discountLabel(d)}</span>
        {d.rewardTitle ? <span className={'text-[#7fbf95]'}>{` · ${d.rewardTitle}`}</span> : null}
      </span>
      {/* корзина снятия — только bitchcard: rebook-скидку снимает лишь админ из календаря */}
      {booking.canCancel && d.type !== 'rebook' && (
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

// Инлайн-подтверждение отмены резервации
const CancelConfirm = ({
  error,
  submitting,
  reason,
  onReasonChange,
  onConfirm,
  onAbort,
}: {
  error: string
  submitting: boolean
  reason: string
  onReasonChange: (value: string) => void
  onConfirm: () => void
  onAbort: () => void
}) => (
  <div className={'mt-4'}>
    <p className={'text-[#A0A0A0] text-xss mb-3'}>{'Opravdu chcete tuto rezervaci zrušit?'}</p>
    <textarea
      value={reason}
      onChange={(e) => onReasonChange(e.target.value)}
      rows={2}
      maxLength={500}
      disabled={submitting}
      placeholder={'Důvod zrušení (nepovinné)'}
      className={
        'w-full resize-none rounded-special-small bg-[#161615] border border-[#3C3C3C] text-white text-xss px-3.5 py-2.5 mb-3 placeholder:text-[#6f6f6f] focus:border-[#E71E6E] focus:outline-none'
      }
    />
    {error && <p className={'text-[#E71E6E] text-xss mb-3'}>{error}</p>}
    <div className={'flex gap-2.5'}>
      <button
        type={'button'}
        onClick={onConfirm}
        disabled={submitting}
        className={`flex-1 transition-colors duration-150 text-white font-semibold text-xss py-3 rounded-special-small ${
          submitting ? 'bg-[#5a5a5a] cursor-progress' : 'bg-[#E71E6E] hover:bg-[#c9195f]'
        }`}
      >
        {submitting ? 'Ruším…' : 'Zrušit rezervaci'}
      </button>
      <button
        type={'button'}
        onClick={onAbort}
        disabled={submitting}
        className={
          'flex-1 border border-[#3C3C3C] text-[#A0A0A0] text-xss py-3 rounded-special-small hover:text-white'
        }
      >
        {'Zpět'}
      </button>
    </div>
  </div>
)

// Кнопки «Změnit termín» / «Zrušit» (одинаковы для hero и компактной карты)
const ActionButtons = ({
  booking,
  onReschedule,
  onCancelClick,
}: {
  booking: ICabinetBooking
  onReschedule: () => void
  onCancelClick: () => void
}) => {
  if (!booking.canReschedule && !booking.canCancel) return null
  return (
    <div className={'flex gap-2.5 mt-4'}>
      {booking.canReschedule && (
        <button
          type={'button'}
          onClick={onReschedule}
          className={
            'flex-1 bg-primary hover:bg-[#c9195f] transition-colors duration-150 text-white font-semibold text-xss py-3 rounded-special-small'
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
            'flex-1 bg-[#2a2a28] border border-[#3C3C3C] text-[#c5c5c5] font-semibold text-xss py-3 rounded-special-small hover:text-white transition-colors'
          }
        >
          {'Zrušit'}
        </button>
      )}
    </div>
  )
}

// Hero-карта ближайшего термина: крупная дата, розовая плашка времени + отсчёт
const HeroCard = ({
  booking: b,
  cancelConfirming,
  cancelSubmitting,
  cancelError,
  cancelReason,
  releaseConfirming,
  releasing,
  releaseError,
  onCancelClick,
  onCancelReasonChange,
  onConfirmCancel,
  onAbortCancel,
  onReschedule,
  onReleaseClick,
  onConfirmRelease,
  onAbortRelease,
}: CardProps) => {
  const { weekday, dayMonth } = heroDate(b.date)
  const cd = countdown(b.date)
  return (
    <div
      className={'relative overflow-hidden rounded-special-small border border-[#4a2a3a] p-5'}
      style={{
        background:
          'radial-gradient(130% 130% at 0% 0%, rgba(231,30,110,0.20) 0%, rgba(28,23,25,0) 55%), #1c1719',
      }}
    >
      <p className={'text-primary text-xss uppercase tracking-[0.14em] mb-3'}>
        {'Nejbližší termín'}
      </p>
      <div className={'flex items-start justify-between gap-4'}>
        <div className={'min-w-0'}>
          <p className={'text-white text-resBig leading-tight'}>{weekday}</p>
          <p className={'text-white text-resBig leading-tight'}>{dayMonth}</p>
          <p className={'text-[#e8e8e8] text-xs1 leading-snug mt-2.5'}>
            {serviceTitle(b) || 'Rezervace'}
          </p>
          {(b.employeeName || b.totalPrice != null) && (
            <p className={'text-[#A0A0A0] text-xss mt-1'}>
              {b.employeeName}
              {b.employeeName && b.totalPrice != null ? ' · ' : ''}
              {b.totalPrice != null && (
                <span className={'text-white'}>
                  <PriceValue booking={b} />
                </span>
              )}
            </p>
          )}
        </div>
        {b.time && (
          <div className={'shrink-0 bg-primary rounded-[10px] px-3.5 py-2.5 text-center'}>
            <p className={'text-white text-resBig leading-none'}>{b.time}</p>
            {cd && (
              <p className={'text-white text-[10px] font-extrabold tracking-wide mt-1'}>{cd}</p>
            )}
          </div>
        )}
      </div>
      <DiscountBlock
        booking={b}
        confirming={releaseConfirming}
        busy={releasing}
        error={releaseError}
        onReleaseClick={onReleaseClick}
        onConfirmRelease={onConfirmRelease}
        onAbortRelease={onAbortRelease}
      />
      {cancelConfirming ? (
        <CancelConfirm
          error={cancelError}
          submitting={cancelSubmitting}
          reason={cancelReason}
          onReasonChange={onCancelReasonChange}
          onConfirm={onConfirmCancel}
          onAbort={onAbortCancel}
        />
      ) : (
        <ActionButtons booking={b} onReschedule={onReschedule} onCancelClick={onCancelClick} />
      )}
    </div>
  )
}

// Компактная карта следующего термина: боковая дата-плашка, разворот по стрелке
const CompactCard = ({
  booking: b,
  cancelConfirming,
  cancelSubmitting,
  cancelError,
  cancelReason,
  releaseConfirming,
  releasing,
  releaseError,
  onCancelClick,
  onCancelReasonChange,
  onConfirmCancel,
  onAbortCancel,
  onReschedule,
  onReleaseClick,
  onConfirmRelease,
  onAbortRelease,
}: CardProps) => {
  const [open, setOpen] = useState(false)
  const { day, month } = dateBox(b.date)
  const dayTime = [weekdayOf(b.date), b.time].filter(Boolean).join(' ')
  const d = b.discount
  return (
    <div className={'bg-[#252523] rounded-special-small overflow-hidden'}>
      <button
        type={'button'}
        onClick={() => setOpen((o) => !o)}
        className={'w-full flex items-center gap-4 px-4 py-3.5 text-left'}
      >
        <div className={'shrink-0 w-12 rounded-special-small bg-[#161615] py-2 text-center'}>
          <p className={'text-white text-sm leading-none'}>{day}</p>
          <p className={'text-[#A0A0A0] text-[10px] font-extrabold tracking-wide mt-1'}>{month}</p>
        </div>
        <div className={'min-w-0 flex-1'}>
          <p className={'text-white text-xs1 leading-snug'}>{serviceTitle(b) || 'Rezervace'}</p>
          <p className={'text-[#A0A0A0] text-xss mt-0.5'}>
            {[dayTime, b.employeeName].filter(Boolean).join(' · ')}
            {b.totalPrice != null && (
              <>
                {dayTime || b.employeeName ? ' · ' : ''}
                <span className={'text-white'}>
                  <PriceValue booking={b} />
                </span>
              </>
            )}
          </p>
        </div>
        <ChevronIcon open={open} />
      </button>
      {!open && d && d.discountKc > 0 && (
        <div className={'px-4 pb-3.5 -mt-1'}>
          <DiscountBadgeReadonly discount={d} />
        </div>
      )}
      {open && (
        <div className={'px-4 pb-4'}>
          <DiscountBlock
            booking={b}
            confirming={releaseConfirming}
            busy={releasing}
            error={releaseError}
            onReleaseClick={onReleaseClick}
            onConfirmRelease={onConfirmRelease}
            onAbortRelease={onAbortRelease}
          />
          {cancelConfirming ? (
            <CancelConfirm
              error={cancelError}
              submitting={cancelSubmitting}
              reason={cancelReason}
              onReasonChange={onCancelReasonChange}
              onConfirm={onConfirmCancel}
              onAbort={onAbortCancel}
            />
          ) : (
            <ActionButtons booking={b} onReschedule={onReschedule} onCancelClick={onCancelClick} />
          )}
        </div>
      )}
    </div>
  )
}

// «+ Rezervovat další termín — {služba} jako minule»
const RebookCta = ({ href, service }: { href: string; service: string }) => (
  <a
    href={href}
    className={
      'block border border-dashed border-[#3C3C3C] rounded-special-small px-5 py-4 text-center text-[#A0A0A0] text-xss hover:text-white hover:border-primary transition-colors'
    }
  >
    {`+ Rezervovat další termín — ${service} jako minule`}
  </a>
)

// Пустое состояние: иконка + приглашение записаться
const EmptyState = () => (
  <div className={'bg-[#252523] rounded-special-small px-6 py-9 text-center'}>
    <div
      className={
        'w-14 h-14 rounded-full bg-[#161615] flex items-center justify-center mx-auto mb-4'
      }
    >
      <CalendarIcon />
    </div>
    <p className={'text-white text-resMd1 mb-1.5'}>{'Zatím nemáte žádnou rezervaci'}</p>
    <p className={'text-[#A0A0A0] text-xss mb-5'}>{'Vyberte si termín a my se o vás postaráme.'}</p>
    <a
      className={
        'inline-block bg-primary hover:bg-[#c9195f] transition-colors duration-150 text-white text-xs1 font-bold rounded-special-small px-7 py-3.5'
      }
      href={'/book'}
    >
      {'Rezervovat termín'}
    </a>
  </div>
)

interface Props {
  bookings: ICabinetBookings
  salonPhone: string
  onChanged: () => void
}

// Секция «Moje rezervace»: hero ближайшего термина + компактные следующие
// (canCancel/canReschedule с сервера) + «Rezervovat znovu» + historie.
export const BookingsSection = ({ bookings, salonPhone, onChanged }: Props) => {
  const [rescheduleId, setRescheduleId] = useState<string | null>(null)
  const [confirmId, setConfirmId] = useState<string | null>(null)
  const [cancelReason, setCancelReason] = useState('')
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
      await postCabinetCancel(confirmId, cancelReason.trim() || undefined)
      setConfirmId(null)
      setCancelReason('')
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
    setCancelReason('')
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

  const cardProps = (b: ICabinetBooking): CardProps => ({
    booking: b,
    cancelConfirming: confirmId === b.documentId,
    cancelSubmitting: submitting,
    cancelError: actionError,
    cancelReason,
    releaseConfirming: releaseId === b.documentId,
    releasing,
    releaseError,
    onCancelClick: () => startCancel(b.documentId),
    onCancelReasonChange: setCancelReason,
    onConfirmCancel: handleConfirmCancel,
    onAbortCancel: () => {
      setConfirmId(null)
      setCancelReason('')
    },
    onReschedule: () => startReschedule(b.documentId),
    onReleaseClick: () => startRelease(b.documentId),
    onConfirmRelease: handleConfirmRelease,
    onAbortRelease: () => setReleaseId(null),
  })

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

  const rebook = buildRebook(bookings)

  return (
    <section>
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
        <EmptyState />
      ) : (
        <div className={'space-y-3'}>
          <HeroCard {...cardProps(bookings.upcoming[0])} />
          {bookings.upcoming.slice(1).map((b) => (
            <CompactCard key={b.documentId} {...cardProps(b)} />
          ))}
          {rebook && <RebookCta href={rebook.href} service={rebook.service} />}
        </div>
      )}
    </section>
  )
}
