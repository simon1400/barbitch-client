import type { ReactNode } from 'react'

// `booking` — styl rezervace (šedý čtvereček na tmavé kartě),
// `soft` — hranatý čtvereček na bílé stránce (objednávka voucheru).
const BOX = {
  booking: {
    box: 'mt-0.5 h-4 w-4 min-w-[16px] rounded border',
    on: 'bg-pink-500 border-pink-500',
    off: 'bg-[#3C3C3B] border-[#4A4A4A]',
    offError: 'bg-[#3C3C3B] border-red-500',
    text: 'text-[#A0A0A0]',
    gap: 'gap-3 py-2.5',
  },
  soft: {
    box: 'mt-0.5 h-5 w-5 min-w-[20px] border-[1.5px]',
    on: 'bg-primary border-primary',
    off: 'bg-white border-accent',
    offError: 'bg-white border-red-500',
    text: 'text-[#444] font-medium',
    gap: 'gap-3',
  },
} as const

/**
 * Zaškrtávátko souhlasu: po zaškrtnutí růžové s fajfkou.
 * Skutečný <input type=checkbox> (klávesnice, čtečky).
 */
export const ConsentCheckbox = ({
  name,
  checked,
  onChange,
  error,
  children,
  textClassName = 'text-[11px] leading-[15px]',
  variant = 'booking',
}: {
  name: string
  checked: boolean
  onChange: (value: boolean) => void
  error?: boolean
  children: ReactNode
  textClassName?: string
  variant?: keyof typeof BOX
}) => {
  const st = BOX[variant]
  return (
    <label className={`flex items-start cursor-pointer ${st.gap}`}>
      <input
        type={'checkbox'}
        name={name}
        checked={checked}
        aria-invalid={error || undefined}
        onChange={(e) => onChange(e.target.checked)}
        className={'peer sr-only'}
      />
      <span
        aria-hidden={'true'}
        className={`${st.box} flex items-center justify-center transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-pink-500/60 ${
          checked ? st.on : error ? st.offError : st.off
        }`}
      >
        {checked && (
          <svg width={'10'} height={'8'} viewBox={'0 0 10 8'} fill={'none'}>
            <path
              d={'M1 4L3.5 6.5L9 1'}
              stroke={'white'}
              strokeWidth={'1.5'}
              strokeLinecap={'round'}
              strokeLinejoin={'round'}
            />
          </svg>
        )}
      </span>
      <span className={`${textClassName} ${error ? 'text-red-500' : st.text}`}>{children}</span>
    </label>
  )
}
