'use client'
import type { FieldVariant } from './Input'

import { Paperclip, X } from 'lucide-react'
import { useRef, useState } from 'react'

import { bookingErrorCls, bookingFieldCls, bookingLabelCls } from './fieldStyles'

const STYLE = {
  default: {
    wrap: 'mb-5',
    label: () => 'font-bold mb-2 block',
    box: () =>
      'w-full min-h-13 rounded-special-small shadow-lg bg-white px-5 py-3 flex items-center gap-3',
    empty: 'h-13 text-gray-500 hover:text-accent',
    name: 'text-sm',
    remove: 'text-gray-500 hover:text-red-500',
    error: 'mt-1 block font-bold text-xss text-red-500',
    icon: 20,
  },
  booking: {
    wrap: '',
    label: (error: boolean) => bookingLabelCls(error),
    box: (error: boolean) =>
      `${bookingFieldCls(error)} min-h-10 px-3.5 py-2 flex items-center gap-3`,
    empty: 'border-dashed text-[#A0A0A0] hover:text-white hover:border-[#929292]',
    name: 'text-book text-white',
    remove: 'text-[#A0A0A0] hover:text-white',
    error: bookingErrorCls,
    icon: 16,
  },
} as const

/**
 * Výběr jednoho souboru (životopis, logo). Kontroluje jen velikost — typ
 * hlídá `accept` a hlavně server (lib/formAttachment.ts).
 */
export const FileField = ({
  name,
  label,
  emptyText,
  accept,
  maxBytes,
  file,
  onChange,
  variant = 'default',
}: {
  name: string
  label: string
  /** Text tlačítka, když není nic vybráno. */
  emptyText: string
  accept: string
  maxBytes: number
  file: File | null
  onChange: (file: File | null) => void
  variant?: Exclude<FieldVariant, 'soft'>
}) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const [error, setError] = useState<string | null>(null)
  const st = STYLE[variant]

  const reset = () => {
    if (inputRef.current) inputRef.current.value = ''
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null)
    const next = e.target.files?.[0] ?? null
    if (next && next.size > maxBytes) {
      setError(`Soubor je příliš velký (max ${Math.round(maxBytes / 1024 / 1024)} MB).`)
      onChange(null)
      reset()
      return
    }
    onChange(next)
  }

  const clear = () => {
    setError(null)
    onChange(null)
    reset()
  }

  const boxCls = st.box(!!error)

  return (
    <div className={st.wrap}>
      <label className={st.label(!!error)} htmlFor={`${name}_input`}>
        {label}
      </label>
      <input
        ref={inputRef}
        type={'file'}
        id={`${name}_input`}
        name={name}
        accept={accept}
        onChange={handleChange}
        className={'sr-only'}
      />
      {file ? (
        <div className={boxCls}>
          <Paperclip className={'shrink-0 text-primary'} size={st.icon} />
          <span className={`grow truncate ${st.name}`}>{file.name}</span>
          <button
            type={'button'}
            onClick={clear}
            aria-label={'Odebrat soubor'}
            className={`shrink-0 ${st.remove}`}
          >
            <X size={st.icon} />
          </button>
        </div>
      ) : (
        <button
          type={'button'}
          onClick={() => inputRef.current?.click()}
          className={`${boxCls} text-left ${st.empty}`}
        >
          <Paperclip className={'shrink-0 text-primary'} size={st.icon} />
          <span className={'truncate'}>{emptyText}</span>
        </button>
      )}
      {error && <span className={st.error}>{error}</span>}
    </div>
  )
}
