'use client'

import type {
  ICabinetBooking,
  ICabinetBookings,
  ICabinetLoyalty,
  ILoyaltyTrackItem,
} from '../fetch/cabinetApi'

import { useState } from 'react'

import { cabinetErrorCode, postCabinetApplyRedemption } from '../fetch/cabinetApi'

import { fmtDay, ghostBtnCls, SectionTitle } from './shared'

// Физическая карта bitchcard = 8 наклеек (FINISH на 8 000 Kč); цифровой трек
// рисует те же 8 кружков, milestone-ступени подсвечены порогом из трека.
const CARD_STAMPS = 8

const REASON_LABELS: Record<string, string> = {
  visit: 'Návštěva',
  manual: 'Úprava salonem',
  signup: 'Bonus za registraci',
  referral: 'Doporučení',
}

const fmtKc = (n: number) => `${n.toLocaleString('cs-CZ')} Kč`

/** «31. 12. 2026» из ISO (битая дата → ''). */
const fmtExpiry = (iso: string | null): string => {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleDateString('cs-CZ', { day: 'numeric', month: 'numeric', year: 'numeric' })
}

const rewardShortLabel = (item: ILoyaltyTrackItem) =>
  item.discountType === 'percent' ? `−${item.discountValue} %` : `−${item.discountValue} Kč`

// Подпись брони в селекте «uplatnit na rezervaci» (без вложенных template literals)
const bookingOptionLabel = (b: ICabinetBooking): string => {
  const time = b.time ? ` v ${b.time}` : ''
  const price = b.totalPrice != null ? ` · ${b.totalPrice} Kč` : ''
  return `${fmtDay(b.date)}${time}${price}`
}

// Кружки-наклейки: заполненные = наклейки (floor balance/1000), milestone-позиции
// (3/5/8 из трека) помечены звёздочкой и подписью скидки.
const StampsRow = ({ loyalty }: { loyalty: ICabinetLoyalty }) => {
  const milestones = new Map<number, ILoyaltyTrackItem>()
  for (const item of loyalty.track) {
    milestones.set(Math.round(item.thresholdKc / 1000), item)
  }
  return (
    <div className={'flex justify-center gap-2 sm:gap-3 flex-wrap mb-3'}>
      {Array.from({ length: CARD_STAMPS }, (_, i) => {
        const n = i + 1
        const filled = loyalty.stamps >= n
        const milestone = milestones.get(n)
        return (
          <div key={n} className={'flex flex-col items-center gap-1'}>
            <div
              className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full border flex items-center justify-center text-xss font-bold ${
                filled
                  ? 'bg-primary border-primary text-white'
                  : 'bg-transparent border-[#3C3C3C] text-[#5a5a5a]'
              } ${milestone && !filled ? 'border-primary/60' : ''}`}
            >
              {milestone ? '✦' : n}
            </div>
            {milestone && (
              <span
                className={`text-[10px] leading-none ${filled ? 'text-primary' : 'text-[#A0A0A0]'}`}
              >
                {rewardShortLabel(milestone)}
              </span>
            )}
          </div>
        )
      })}
    </div>
  )
}

// Строка ступени трека: достигнута → код + срок (+ уплатнение на бронь),
// использована → ✓, не достигнута → сколько осталось.
const TrackRow = ({
  item,
  balanceKc,
  applying,
  submitting,
  error,
  upcoming,
  onStartApply,
  onConfirmApply,
  onAbortApply,
}: {
  item: ILoyaltyTrackItem
  balanceKc: number
  applying: boolean
  submitting: boolean
  error: string
  upcoming: ICabinetBooking[]
  onStartApply: () => void
  onConfirmApply: (bookingId: string) => void
  onAbortApply: () => void
}) => {
  const [bookingId, setBookingId] = useState(upcoming[0]?.documentId ?? '')
  const r = item.redemption
  const statusNode = (() => {
    if (!item.reached) {
      return null
    }
    if (r?.status === 'used') {
      return <span className={'text-[#4ade80] text-xss'}>{'✓ Uplatněno'}</span>
    }
    if (r?.status === 'expired') {
      return <span className={'text-[#5a5a5a] text-xss'}>{'Platnost vypršela'}</span>
    }
    if (r?.status === 'available' && r.code) {
      return (
        <span className={'text-white text-xss'}>
          {'Kód: '}
          <span className={'font-mono font-bold text-primary'}>{r.code}</span>
          {r.expiresAt ? (
            <span className={'text-[#A0A0A0]'}>{` · platí do ${fmtExpiry(r.expiresAt)}`}</span>
          ) : null}
        </span>
      )
    }
    return null
  })()

  return (
    <div className={'py-3 border-b border-[#3C3C3C] last:border-0'}>
      <div className={'flex items-center justify-between gap-3'}>
        <div className={'text-left'}>
          <p className={`text-xs1 font-semibold ${item.reached ? 'text-white' : 'text-[#A0A0A0]'}`}>
            {item.title}
          </p>
          <p className={'text-[#A0A0A0] text-xss'}>{`od ${fmtKc(item.thresholdKc)}`}</p>
        </div>
        <div className={'text-right'}>
          {statusNode ?? (
            <span className={'text-[#A0A0A0] text-xss'}>
              {item.reached ? '' : `zbývá ${fmtKc(Math.max(0, item.thresholdKc - balanceKc))}`}
            </span>
          )}
        </div>
      </div>
      {r?.status === 'available' && r.code && (
        <div className={'mt-2.5 text-left'}>
          {applying ? (
            <div className={'bg-[#161615] rounded-special-small p-3'}>
              <p className={'text-[#A0A0A0] text-xss mb-2'}>
                {'Sleva se uplatní na celou cenu vybrané rezervace.'}
              </p>
              {upcoming.length > 1 && (
                <select
                  value={bookingId}
                  onChange={(e) => setBookingId(e.target.value)}
                  className={
                    'w-full bg-[#252523] border border-[#3C3C3C] rounded-special-small px-3 py-2.5 text-white text-xss outline-none focus:border-primary mb-2'
                  }
                >
                  {upcoming.map((b) => (
                    <option key={b.documentId} value={b.documentId}>
                      {bookingOptionLabel(b)}
                    </option>
                  ))}
                </select>
              )}
              {error && <p className={'text-[#E71E6E] text-xss mb-2'}>{error}</p>}
              <div className={'flex flex-wrap gap-2'}>
                <button
                  type={'button'}
                  disabled={submitting || !bookingId}
                  onClick={() => onConfirmApply(bookingId)}
                  className={`transition-colors duration-150 text-white font-semibold text-xss px-5 py-2.5 rounded-special-small ${
                    submitting ? 'bg-[#5a5a5a] cursor-progress' : 'bg-primary hover:bg-[#c9195f]'
                  }`}
                >
                  {submitting ? 'Uplatňuji…' : 'Uplatnit slevu'}
                </button>
                <button
                  type={'button'}
                  disabled={submitting}
                  onClick={onAbortApply}
                  className={
                    'border border-[#3C3C3C] text-[#A0A0A0] text-xss px-5 py-2.5 rounded-special-small hover:text-white'
                  }
                >
                  {'Zpět'}
                </button>
              </div>
            </div>
          ) : upcoming.length > 0 ? (
            <button
              type={'button'}
              onClick={onStartApply}
              className={
                'border border-[#E71E6E] text-[#E71E6E] font-semibold text-xss px-5 py-2.5 rounded-special-small hover:bg-[#E71E6E14]'
              }
            >
              {'Uplatnit na rezervaci'}
            </button>
          ) : (
            <p className={'text-[#A0A0A0] text-xss'}>
              {'Kód stačí nahlásit při návštěvě v salonu.'}
            </p>
          )}
        </div>
      )}
    </div>
  )
}

interface Props {
  loyalty: ICabinetLoyalty
  bookings: ICabinetBookings
  onChanged: () => void
}

// Секция «Věrnostní program» (К4): цифровая bitchcard — наклейки за každých
// 1 000 Kč, трек ступеней (kód + platnost), uplatnění награды на предстоящую
// бронь, свернутая история транзакций. Стиль 1:1 с остальными секциями кабинета.
export const LoyaltySection = ({ loyalty, bookings, onChanged }: Props) => {
  // индекс ступени трека, у которой открыт инлайн «уплатнить на бронь»
  const [applyingIdx, setApplyingIdx] = useState<number | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [applyError, setApplyError] = useState('')
  const [flash, setFlash] = useState('')
  const [showTx, setShowTx] = useState(false)

  const nextStampKc = 1000 - (loyalty.balanceKc % 1000 || 0)

  const applyErrorMessage = (code: string): string => {
    if (code === 'redemption_unavailable') return 'Sleva už byla uplatněna nebo vypršela.'
    if (code === 'booking_has_redemption') return 'Na této rezervaci už je uplatněna sleva.'
    if (code === 'booking_not_active') return 'Rezervace už není aktivní.'
    return 'Uplatnění se nepodařilo. Zkuste to prosím znovu.'
  }

  const handleApply = async (item: ILoyaltyTrackItem, bookingId: string) => {
    if (submitting || !item.redemption?.code) return
    setSubmitting(true)
    setApplyError('')
    try {
      const res = await postCabinetApplyRedemption(bookingId, item.redemption.code)
      setApplyingIdx(null)
      setFlash(`Sleva uplatněna — nová cena rezervace ${res.totalPrice} Kč.`)
      onChanged()
    } catch (err) {
      setApplyError(applyErrorMessage(cabinetErrorCode(err)))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section>
      <SectionTitle>{`Věrnostní program — bitchcard ${loyalty.cardYear}`}</SectionTitle>
      {flash && (
        <div
          className={
            'bg-[#1f3527] border border-[#2f6b3f] rounded-special-small px-5 py-3.5 text-center mb-4'
          }
        >
          <p className={'text-[#4ade80] text-xss'}>{`✓ ${flash}`}</p>
        </div>
      )}
      <div className={'bg-[#252523] rounded-special-small px-5 py-4 text-center'}>
        <p className={'text-white text-xs1 mb-3'}>
          {'Letos utraceno: '}
          <span className={'font-bold text-primary'}>{fmtKc(loyalty.balanceKc)}</span>
        </p>
        <StampsRow loyalty={loyalty} />
        <p className={'text-[#A0A0A0] text-xss'}>
          {loyalty.stamps >= CARD_STAMPS
            ? 'Karta je plná — gratulujeme! ✦'
            : `Nálepka za každých 1 000 Kč · do další zbývá ${fmtKc(nextStampKc)}`}
        </p>
        <div className={'mt-4 text-left'}>
          {loyalty.track.map((item, idx) => (
            <TrackRow
              key={`${item.thresholdKc}_${item.title}`}
              item={item}
              balanceKc={loyalty.balanceKc}
              applying={applyingIdx === idx}
              submitting={submitting}
              error={applyError}
              upcoming={bookings.upcoming}
              onStartApply={() => {
                setFlash('')
                setApplyError('')
                setApplyingIdx(idx)
              }}
              onConfirmApply={(bookingId) => handleApply(item, bookingId)}
              onAbortApply={() => setApplyingIdx(null)}
            />
          ))}
        </div>
        <p className={'text-[#A0A0A0] text-[11px] leading-snug mt-3'}>
          {'Slevy platí na celou návštěvu a lze je čerpat do 31. 12. daného roku.'}
        </p>
      </div>
      {loyalty.transactions.length > 0 && (
        <div className={'mt-3'}>
          <button type={'button'} onClick={() => setShowTx((v) => !v)} className={ghostBtnCls}>
            {showTx ? 'Skrýt historii bodů' : `Historie bodů (${loyalty.transactions.length})`}
          </button>
          {showTx && (
            <div className={'bg-[#252523] rounded-special-small px-5 py-2 mt-2.5'}>
              <ul>
                {loyalty.transactions.map((tx) => (
                  <li
                    key={`${tx.createdAt}_${tx.reason}_${tx.delta}`}
                    className={
                      'flex justify-between gap-4 py-2.5 border-b border-[#3C3C3C] last:border-0 text-xss'
                    }
                  >
                    <span className={'text-[#A0A0A0] whitespace-nowrap'}>
                      {new Date(tx.createdAt).toLocaleDateString('cs-CZ')}
                    </span>
                    <span className={'text-white text-right flex-1'}>
                      {REASON_LABELS[tx.reason] ?? tx.reason}
                      {tx.comment ? ` · ${tx.comment}` : ''}
                    </span>
                    <span className={tx.delta >= 0 ? 'text-[#4ade80]' : 'text-[#E71E6E]'}>
                      {`${tx.delta >= 0 ? '+' : ''}${tx.delta} Kč`}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </section>
  )
}
