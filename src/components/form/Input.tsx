import type { HTMLInputTypeAttribute, ReactNode } from 'react'

import {
  bookingErrorCls,
  bookingFieldCls,
  bookingHintCls,
  bookingLabelCls,
  softErrorCls,
  softFieldCls,
  softHintCls,
  softLabelCls,
} from './fieldStyles'

export { BOOKING_CARD } from './fieldStyles'

// `booking` — styl polí z rezervace (tmavá karta), `soft` — světlá pole na bílé
// stránce; oba viz fieldStyles.ts. Bez `variant` vypadá jako dřív (kariéra).
export type FieldVariant = 'default' | 'booking' | 'soft'

const STYLED = {
  booking: {
    label: bookingLabelCls,
    field: (error?: boolean) => `${bookingFieldCls(error)} h-10 px-3.5`,
    hint: bookingHintCls,
    error: bookingErrorCls,
  },
  soft: {
    label: softLabelCls,
    field: (error?: boolean) => `${softFieldCls(error)} h-[50px] px-5`,
    hint: softHintCls,
    error: softErrorCls,
  },
} as const

export const Input = ({
  name,
  label,
  value,
  placeholder,
  handleChange,
  required,
  error,
  errorText,
  warning,
  warningText,
  variant = 'default',
  type = 'text',
  maxLength,
  min,
  inputMode,
  autoComplete,
  hint,
  className = '',
}: {
  name: string
  label: string
  value: string
  placeholder?: string
  handleChange: (name: string, value: string) => void
  required?: boolean
  error?: boolean
  errorText?: string
  warning?: boolean
  warningText?: string
  variant?: FieldVariant
  type?: HTMLInputTypeAttribute
  maxLength?: number
  min?: number
  inputMode?: 'text' | 'email' | 'tel' | 'numeric'
  autoComplete?: string
  /** Text pod polem (počitadlo znaků apod.). */
  hint?: ReactNode
  className?: string
}) => {
  const control = {
    name,
    id: `${name}_input`,
    type,
    placeholder: placeholder || '',
    value,
    maxLength,
    min,
    inputMode,
    autoComplete,
    'aria-invalid': error || undefined,
    'aria-describedby': hint ? `${name}_hint` : undefined,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
      handleChange(e.target.name, e.target.value),
  }

  if (variant !== 'default') {
    const st = STYLED[variant]
    return (
      <div className={className}>
        <label className={st.label(error)} htmlFor={`${name}_input`}>
          {label}
          {required && <span className={'text-primary'}>{' *'}</span>}
        </label>
        <input {...control} className={st.field(error)} />
        {!!hint && (
          <p id={`${name}_hint`} className={st.hint}>
            {hint}
          </p>
        )}
        {error && !!errorText && <span className={st.error}>{errorText}</span>}
      </div>
    )
  }

  return (
    <div className={`mb-5 relative ${className}`}>
      <label
        className={`font-bold mb-2 block ${error && 'text-red-500'}`}
        htmlFor={`${name}_input`}
      >
        {label}
        {required && <span className={'text-primary'}>{' *'}</span>}
      </label>
      <input
        {...control}
        className={`w-full h-13 rounded-special-small shadow-lg bg-white px-5 outline-primary ${error ? 'border-2 border-red-500' : ''} ${warning && !error ? 'border-2 border-yellow-500' : ''}`}
      />
      {!!hint && (
        <p id={`${name}_hint`} className={'mt-1.5 text-[13px] leading-[19px] text-[#767676]'}>
          {hint}
        </p>
      )}
      {error && (
        <span className={'absolute right-0 text-red-500 block font-bold text-xss'}>
          {errorText || 'Zadajte správne údaje'}
        </span>
      )}
      {warning && !error && (
        <span className={'absolute right-0 text-yellow-600 block font-bold text-xss'}>
          {warningText || 'Upozornění'}
        </span>
      )}
    </div>
  )
}
