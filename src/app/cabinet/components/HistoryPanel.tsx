'use client'

import type { ICabinetBooking } from '../fetch/cabinetApi'

import { useState } from 'react'

import { fmtMonthYear, ghostBtnCls, PanelHeader, visitsLabel } from './shared'

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

// Строка истории: дата + статус-чип сверху, услуга приглушённой строкой ниже.
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

interface Props {
  history: ICabinetBooking[]
  onBack: () => void
}

// Под-панель «Historie návštěv»: шапка с «‹» назад + полный список визитов.
export const HistoryPanel = ({ history, onBack }: Props) => {
  const [showAll, setShowAll] = useState(false)
  const visible = showAll ? history : history.slice(0, HISTORY_PREVIEW)
  const hidden = history.length - visible.length
  // «12 návštěv od ledna 2025» — самый ранний визит = последний элемент (список desc)
  const firstDate = history.length ? history[history.length - 1].date : null
  const fromLabel = firstDate ? ` od ${fmtMonthYear(firstDate)}` : ''
  const subtitle = history.length ? `${visitsLabel(history.length)}${fromLabel}` : undefined

  return (
    <section>
      <PanelHeader title={'Historie návštěv'} subtitle={subtitle} onBack={onBack} />
      {history.length === 0 ? (
        <div className={'bg-[#252523] rounded-special-small px-5 py-6 text-center'}>
          <p className={'text-[#A0A0A0] text-xss'}>{'Zatím nemáte žádné návštěvy.'}</p>
        </div>
      ) : (
        <>
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
      )}
    </section>
  )
}
