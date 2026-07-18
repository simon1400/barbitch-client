'use client'

import type { ICabinetBooking, ICabinetBookings } from '../fetch/cabinetApi'

import { RescheduleCalendar } from 'components/booking/RescheduleCalendar'
import { useCallback, useState } from 'react'

import {
  cabinetErrorCode,
  getCabinetBookingAvailability,
  postCabinetCancel,
  postCabinetReschedule,
} from '../fetch/cabinetApi'

import { Box, fmtDay, ghostBtnCls, SectionTitle, STATUS_LABELS } from './shared'

const serviceTitle = (b: ICabinetBooking): string =>
  (b.services ?? [])
    .map((s) => s?.title)
    .filter(Boolean)
    .join(', ')

const BookingCard = ({
  booking,
  confirming,
  submitting,
  error,
  onCancelClick,
  onConfirmCancel,
  onAbortCancel,
  onReschedule,
}: {
  booking: ICabinetBooking
  confirming: boolean
  submitting: boolean
  error: string
  onCancelClick: () => void
  onConfirmCancel: () => void
  onAbortCancel: () => void
  onReschedule: () => void
}) => (
  <div className={'bg-[#252523] rounded-special-small px-5 py-4 mb-4'}>
    <p className={'text-white text-xs1 font-semibold'}>
      {fmtDay(booking.date)}
      {booking.time ? ` v ${booking.time}` : ''}
    </p>
    <p className={'text-[#A0A0A0] text-xss mt-1'}>
      {serviceTitle(booking) || 'Rezervace'}
      {booking.employeeName ? ` · ${booking.employeeName}` : ''}
      {booking.totalPrice != null ? ` · ${booking.totalPrice} Kč` : ''}
    </p>
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

const HistoryRow = ({ booking }: { booking: ICabinetBooking }) => (
  <li
    className={'flex justify-between gap-4 py-2.5 border-b border-[#3C3C3C] last:border-0 text-xss'}
  >
    <span className={'text-[#A0A0A0] whitespace-nowrap'}>
      {booking.date ? booking.date.split('-').reverse().join('.') : '—'}
    </span>
    <span className={'text-white text-right flex-1'}>{serviceTitle(booking) || 'Rezervace'}</span>
    <span
      className={
        booking.status === 'cancelled' || booking.status === 'noshow'
          ? 'text-[#E71E6E]'
          : 'text-[#A0A0A0]'
      }
    >
      {STATUS_LABELS[booking.status] ?? booking.status}
    </span>
  </li>
)

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
    setConfirmId(id)
  }

  const startReschedule = (id: string) => {
    setFlash('')
    setRescheduleId(id)
  }

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
      ) : (
        bookings.upcoming.map((b) => (
          <BookingCard
            key={b.documentId}
            booking={b}
            confirming={confirmId === b.documentId}
            submitting={submitting}
            error={actionError}
            onCancelClick={() => startCancel(b.documentId)}
            onConfirmCancel={handleConfirmCancel}
            onAbortCancel={() => setConfirmId(null)}
            onReschedule={() => startReschedule(b.documentId)}
          />
        ))
      )}
      {bookings.history.length > 0 && (
        <>
          <SectionTitle>{'Historie návštěv'}</SectionTitle>
          <div className={'bg-[#252523] rounded-special-small px-5 py-2'}>
            <ul>
              {bookings.history.map((b) => (
                <HistoryRow key={b.documentId} booking={b} />
              ))}
            </ul>
          </div>
        </>
      )}
    </section>
  )
}
