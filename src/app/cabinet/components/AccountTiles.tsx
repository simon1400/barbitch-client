'use client'

import type { ICabinetBookings, ICabinetClient } from '../fetch/cabinetApi'

import { fmtDayMonth, visitsLabel } from './shared'

const Tile = ({
  title,
  summary,
  cta,
  onClick,
}: {
  title: string
  summary: string
  cta: string
  onClick: () => void
}) => (
  <button
    type={'button'}
    onClick={onClick}
    className={
      'text-left bg-[#252523] rounded-special-small px-5 py-4 hover:bg-[#2c2c2a] transition-colors'
    }
  >
    <p className={'text-white text-xs1 font-semibold'}>{title}</p>
    <p className={'text-[#A0A0A0] text-xss mt-1 mb-3 leading-snug break-words'}>{summary}</p>
    <span className={'text-primary text-xss font-semibold'}>{cta}</span>
  </button>
)

interface Props {
  bookings: ICabinetBookings
  client: ICabinetClient
  onOpenHistory: () => void
  onOpenProfile: () => void
}

// Две плашки внизу дашборда: свёрнутые «Historie» и «Profil» (клик → под-панель).
export const AccountTiles = ({ bookings, client, onOpenHistory, onOpenProfile }: Props) => {
  const n = bookings.history.length
  const last = bookings.history[0]?.date ?? null
  const lastLabel = last ? ` · poslední ${fmtDayMonth(last)}` : ''
  const historySummary = n ? `${visitsLabel(n)}${lastLabel}` : 'Zatím žádné návštěvy'
  const profileSummary = client.email || client.phone || 'Doplňte údaje'

  return (
    <div className={'grid grid-cols-2 gap-3 mt-8'}>
      <Tile
        title={'Historie'}
        summary={historySummary}
        cta={'Zobrazit →'}
        onClick={onOpenHistory}
      />
      <Tile title={'Profil'} summary={profileSummary} cta={'Upravit →'} onClick={onOpenProfile} />
    </div>
  )
}
