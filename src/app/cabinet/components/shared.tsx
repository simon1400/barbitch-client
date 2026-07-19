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

/** «24. 6.» из YYYY-MM-DD (для сводок). */
export const fmtDayMonth = (date: string | null): string => {
  if (!date) return ''
  try {
    return format(parseISO(date), 'd. M.', { locale: cs })
  } catch {
    return ''
  }
}

/** «ledna 2025» из YYYY-MM-DD (месяц в родительном + год). */
export const fmtMonthYear = (date: string | null): string => {
  if (!date) return ''
  try {
    return format(parseISO(date), 'MMMM yyyy', { locale: cs })
  } catch {
    return ''
  }
}

/** Чешская множественность визитов: 1 návštěva / 2–4 návštěvy / N návštěv. */
export const visitsLabel = (n: number): string => {
  if (n === 1) return '1 návštěva'
  if (n >= 2 && n <= 4) return `${n} návštěvy`
  return `${n} návštěv`
}

/** Шапка под-панели: кнопка «‹» назад + заголовок + подзаголовок. */
export const PanelHeader = ({
  title,
  subtitle,
  onBack,
}: {
  title: string
  subtitle?: string
  onBack: () => void
}) => (
  <div className={'flex items-start gap-3 mb-4'}>
    <button
      type={'button'}
      onClick={onBack}
      aria-label={'Zpět'}
      className={
        'shrink-0 w-11 h-11 flex items-center justify-center rounded-special-small bg-[#252523] border border-[#3C3C3C] text-[#A0A0A0] hover:text-white transition-colors'
      }
    >
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
        <path d={'m15 18-6-6 6-6'} />
      </svg>
    </button>
    <div className={'min-w-0'}>
      <h2 className={'text-white text-resLg leading-none'}>{title}</h2>
      {subtitle && <p className={'text-[#A0A0A0] text-xss mt-1.5'}>{subtitle}</p>}
    </div>
  </div>
)

export const primaryBtnCls = (busy?: boolean) =>
  `w-full max-w-[270px] transition-colors duration-150 text-white font-semibold text-xs1 py-3.5 rounded-special-small ${
    busy ? 'bg-[#5a5a5a] cursor-progress' : 'bg-primary hover:bg-[#c9195f]'
  }`

export const ghostBtnCls =
  'w-full max-w-[270px] border border-[#3C3C3C] text-[#A0A0A0] text-xs1 py-3 rounded-special-small hover:text-white'

export const inputCls =
  'w-full bg-[#161615] border border-[#3C3C3C] rounded-special-small px-4 py-3 text-white text-xs1 outline-none focus:border-primary'
