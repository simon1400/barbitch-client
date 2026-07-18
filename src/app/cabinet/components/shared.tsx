'use client'

import { format, parseISO } from 'date-fns'
import { cs } from 'date-fns/locale/cs'

// Общие кирпичики кабинета (стиль 1:1 со страницей /rezervace/{token}).

export const STATUS_LABELS: Record<string, string> = {
  active: 'Aktivní',
  checkedOut: 'Proběhla',
  cancelled: 'Zrušena',
  noshow: 'Nedostavila se',
}

export const Box = ({ children }: { children: React.ReactNode }) => (
  <div className={'bg-[#252523] rounded-special-small p-6 text-center'}>{children}</div>
)

export const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h2 className={'text-white text-resMd1 mb-3 mt-8'}>{children}</h2>
)

/** «pátek 24. 7. 2026» из YYYY-MM-DD (пустая/битая дата → ''). */
export const fmtDay = (date: string | null): string => {
  if (!date) return ''
  try {
    return format(parseISO(date), 'EEEE d. M. yyyy', { locale: cs })
  } catch {
    return date
  }
}

export const primaryBtnCls = (busy?: boolean) =>
  `w-full max-w-[270px] transition-colors duration-150 text-white font-semibold text-xs1 py-3.5 rounded-special-small ${
    busy ? 'bg-[#5a5a5a] cursor-progress' : 'bg-primary hover:bg-[#c9195f]'
  }`

export const ghostBtnCls =
  'w-full max-w-[270px] border border-[#3C3C3C] text-[#A0A0A0] text-xs1 py-3 rounded-special-small hover:text-white'

export const inputCls =
  'w-full bg-[#161615] border border-[#3C3C3C] rounded-special-small px-4 py-3 text-white text-xs1 outline-none focus:border-primary'
