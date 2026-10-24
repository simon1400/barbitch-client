import type { FieldVariant } from './Input'

import {
  bookingHintCls,
  bookingLabelCls,
  bookingTextareaCls,
  softHintCls,
  softLabelCls,
  softTextareaCls,
} from './fieldStyles'

const STYLED = {
  booking: { label: bookingLabelCls, field: bookingTextareaCls, hint: bookingHintCls },
  soft: { label: softLabelCls, field: softTextareaCls, hint: softHintCls },
} as const

export const Textarea = ({
  name,
  label,
  value,
  handleChange,
  placeholder,
  variant = 'default',
  maxLength,
  hint,
  className = '',
}: {
  name: string
  label: string
  value: string
  handleChange: (name: string, value: string) => void
  placeholder?: string
  variant?: FieldVariant
  maxLength?: number
  hint?: React.ReactNode
  className?: string
}) => {
  const control = {
    id: `${name}_textarea`,
    name,
    value,
    placeholder,
    maxLength,
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) =>
      handleChange(e.target.name, e.target.value),
  }

  if (variant !== 'default') {
    const st = STYLED[variant]
    return (
      <div className={className}>
        <label className={st.label()} htmlFor={`${name}_textarea`}>
          {label}
        </label>
        <textarea {...control} className={st.field()} />
        {!!hint && <p className={st.hint}>{hint}</p>}
      </div>
    )
  }

  return (
    <div className={`mb-5 ${className}`}>
      <label className={'font-bold mb-2 block'} htmlFor={`${name}_textarea`}>
        {label}
      </label>
      <textarea
        {...control}
        className={
          'w-full h-40 rounded-special-small shadow-lg bg-white p-5 outline-primary resize-none'
        }
      />
    </div>
  )
}
