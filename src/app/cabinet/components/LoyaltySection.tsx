'use client'

import type {
  ICabinetBooking,
  ICabinetBookings,
  ICabinetLoyalty,
  ILoyaltyTrackItem,
  ILoyaltyTransaction,
} from '../fetch/cabinetApi'

import { Fragment, useState } from 'react'

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

// Наклейки 1..8 (za každých 1 000 Kč), соединённые прогресс-линией. Milestone
// (3-я / 5-я / 8-я — порог/1000) = тот же кружок со звёздочкой-бейджем и
// подписью скидки под ним, отдельных кружков наград нет.
const stampCircleCls = (filled: boolean, isMilestone: boolean): string => {
  if (filled) {
    const glow = 'bg-primary border-primary text-white shadow-[0_0_10px_rgba(231,30,110,0.4)]'
    return isMilestone ? `${glow} ring-2 ring-primary/35 ring-offset-2 ring-offset-[#252523]` : glow
  }
  return isMilestone
    ? 'bg-transparent border-dashed border-primary/50 text-primary/70'
    : 'bg-transparent border-[#3C3C3C] text-[#5a5a5a]'
}

const StampsRow = ({ loyalty }: { loyalty: ICabinetLoyalty }) => {
  const milestones = new Map<number, ILoyaltyTrackItem>()
  for (const item of loyalty.track) {
    milestones.set(Math.round(item.thresholdKc / 1000), item)
  }
  return (
    <div className={'flex items-start pb-5 mb-2'}>
      {Array.from({ length: CARD_STAMPS }, (_, i) => {
        const n = i + 1
        const filled = loyalty.stamps >= n
        const milestone = milestones.get(n)
        return (
          <Fragment key={n}>
            {n > 1 && (
              <div
                className={`h-0.5 flex-1 mx-0.5 mt-[15px] sm:mt-[19px] ${
                  filled ? 'bg-primary' : 'bg-[#3C3C3C]'
                }`}
              />
            )}
            <div className={'relative shrink-0'}>
              <div
                title={milestone?.title}
                className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full border flex items-center justify-center text-xss font-bold ${stampCircleCls(
                  filled,
                  Boolean(milestone),
                )}`}
              >
                {n}
              </div>
              {milestone && (
                <>
                  <span
                    className={`absolute -top-1 -right-1 w-4 h-4 rounded-full border flex items-center justify-center text-[9px] leading-none ${
                      filled
                        ? 'bg-primary border-[#252523] text-white'
                        : 'bg-[#252523] border-primary/50 text-primary'
                    }`}
                  >
                    {'✦'}
                  </span>
                  <span
                    className={`absolute top-full left-1/2 -translate-x-1/2 mt-1.5 whitespace-nowrap text-[10px] leading-none font-semibold ${
                      filled ? 'text-primary' : 'text-[#A0A0A0]'
                    }`}
                  >
                    {rewardShortLabel(milestone)}
                  </span>
                </>
              )}
            </div>
          </Fragment>
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
  const used = r?.status === 'used'
  const expired = r?.status === 'expired'
  const available = r?.status === 'available' && Boolean(r.code)
  const pct = Math.min(100, Math.round((balanceKc / item.thresholdKc) * 100))

  const statusPill = (() => {
    if (!item.reached) {
      return (
        <span className={'text-[#8f8f8f] text-xss whitespace-nowrap'}>
          {`zbývá ${fmtKc(Math.max(0, item.thresholdKc - balanceKc))}`}
        </span>
      )
    }
    if (used) {
      return (
        <span
          className={
            'inline-flex items-center gap-1 bg-[#1f3527] text-[#4ade80] text-[11px] font-bold rounded-full px-2.5 py-1 whitespace-nowrap'
          }
        >
          {'✓ Uplatněno'}
        </span>
      )
    }
    if (expired) {
      return (
        <span
          className={
            'bg-[#2f2f2d] text-[#8f8f8f] text-[11px] font-bold rounded-full px-2.5 py-1 whitespace-nowrap'
          }
        >
          {'Vypršelo'}
        </span>
      )
    }
    if (available) {
      return (
        <span
          className={
            'bg-[#3a1526] text-primary text-[11px] font-bold rounded-full px-2.5 py-1 whitespace-nowrap'
          }
        >
          {'K dispozici'}
        </span>
      )
    }
    return null
  })()

  return (
    <div className={'py-3.5 border-b border-[#3C3C3C] last:border-0'}>
      <div className={'flex items-center justify-between gap-3'}>
        <div className={'text-left'}>
          <p className={`text-xs1 font-semibold ${item.reached ? 'text-white' : 'text-[#8f8f8f]'}`}>
            {item.title}
          </p>
          <p className={'text-[#7a7a7a] text-[11px] mt-0.5'}>{`od ${fmtKc(item.thresholdKc)}`}</p>
        </div>
        {statusPill}
      </div>

      {!item.reached && (
        <div className={'mt-2 h-1.5 bg-[#161615] rounded-full overflow-hidden'}>
          <div className={'h-full bg-[#E71E6E] rounded-full'} style={{ width: `${pct}%` }} />
        </div>
      )}

      {available && (
        <div
          className={
            'mt-2.5 bg-[#161615] border border-dashed border-[#3a3a38] rounded-special-small p-3'
          }
        >
          <div className={'flex items-center justify-between gap-3 flex-wrap'}>
            <span className={'text-[#A0A0A0] text-xss'}>
              {'Kód '}
              <span className={'font-mono font-bold text-primary text-xs1 tracking-wider'}>
                {r?.code}
              </span>
            </span>
            {r?.expiresAt && (
              <span className={'text-[#7a7a7a] text-[11px] whitespace-nowrap'}>
                {`platí do ${fmtExpiry(r.expiresAt)}`}
              </span>
            )}
          </div>
          <div className={'mt-2.5'}>
            {applying ? (
              <>
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
                    className={`flex-1 transition-colors duration-150 text-white font-semibold text-xss px-5 py-2.5 rounded-special-small ${
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
              </>
            ) : upcoming.length > 0 ? (
              <button
                type={'button'}
                onClick={onStartApply}
                className={
                  'w-full border border-[#E71E6E] text-[#E71E6E] font-semibold text-xss px-5 py-2.5 rounded-special-small hover:bg-[#E71E6E14]'
                }
              >
                {'Uplatnit na rezervaci'}
              </button>
            ) : (
              <p className={'text-[#8f8f8f] text-xss'}>
                {'Kód stačí nahlásit při návštěvě v salonu.'}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// Строка истории баллов: причина (белым) + дата (мелкой серой) слева, сумма
// справа. Комментарий показываем только если он НЕ повторяет причину.
const TransactionRow = ({ tx }: { tx: ILoyaltyTransaction }) => {
  const label = REASON_LABELS[tx.reason] ?? tx.reason
  const comment = tx.comment ?? ''
  const showComment = comment !== '' && !comment.toLowerCase().startsWith(label.toLowerCase())
  return (
    <li
      className={
        'flex items-center justify-between gap-3 py-2.5 border-b border-[#3C3C3C] last:border-0'
      }
    >
      <div className={'min-w-0 text-left'}>
        <p className={'text-white text-xss'}>{label}</p>
        {showComment && (
          <p className={'text-[#8f8f8f] text-[11px] leading-snug mt-0.5'}>{comment}</p>
        )}
        <p className={'text-[#7a7a7a] text-[11px] mt-0.5'}>
          {new Date(tx.createdAt).toLocaleDateString('cs-CZ')}
        </p>
      </div>
      <span
        className={`text-xss font-bold whitespace-nowrap ${
          tx.delta >= 0 ? 'text-[#4ade80]' : 'text-[#E71E6E]'
        }`}
      >
        {`${tx.delta >= 0 ? '+' : ''}${tx.delta} Kč`}
      </span>
    </li>
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
  // На одну бронь = одна скидка → в выбор попадают только брони без уже
  // применённой награды (иначе движок вернёт booking_has_redemption).
  const applicableBookings = bookings.upcoming.filter((b) => !b.discount)

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
      <div className={'bg-[#252523] rounded-special-small px-5 pt-5 pb-4 text-center'}>
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
              upcoming={applicableBookings}
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
          {'Slevy platí vždy na jednu službu a lze je čerpat do 31. 12. daného roku.'}
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
                  <TransactionRow key={`${tx.createdAt}_${tx.reason}_${tx.delta}`} tx={tx} />
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </section>
  )
}
