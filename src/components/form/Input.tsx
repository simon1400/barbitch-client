export const Input = ({
  name,
  label,
  value,
  placeholder,
  handleChange,
  required,
  error,
  warning,
  warningText,
}: {
  name: string
  label: string
  value: string
  placeholder?: string
  handleChange: (name: string, value: string) => void
  required?: boolean
  error?: boolean
  warning?: boolean
  warningText?: string
}) => {
  return (
    <div className={'mb-5 relative'}>
      <label
        className={`font-bold mb-2 block ${error && 'text-red-500'}`}
        htmlFor={`${name}_input`}
      >
        {label}
        {required && <span className={'text-primary'}>{' *'}</span>}
      </label>
      <input
        className={`w-full h-13 rounded-special-small shadow-lg bg-white px-5 outline-primary ${error && 'border-2 border-red-500'} ${warning && !error && 'border-2 border-yellow-500'}`}
        name={name}
        id={`${name}_input`}
        type={'text'}
        placeholder={placeholder || ''}
        value={value}
        onChange={(e) => handleChange(e.target.name, e.target.value)}
      />
      {error && (
        <span className={'absolute right-0 text-red-500 block font-bold text-xss'}>
          {'Zadajte správne údaje'}
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
