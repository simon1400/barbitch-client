export const DeliveryMethod = ({
  name,
  label,
  checked,
  handleChange,
  required,
}: {
  name: string
  label: string
  checked: string
  handleChange: (name: string, value: string) => void
  required?: boolean
}) => {
  const options = [
    {
      value: 'email',
      label: 'E-mail (voucher v PDF)',
      description: 'Voucher přijde ihned na e-mail',
    },
    {
      value: 'mail',
      label: 'Poštou (vytištěný voucher)',
      description: '+100 Kč',
    },
    {
      value: 'pickup',
      label: 'Osobní vyzvednutí',
      description: '+50 Kč',
    },
  ]

  return (
    <div className={'mb-5'}>
      <label className={'font-bold mb-2 block'}>
        {label}
        {required && <span className={'text-primary'}>{' *'}</span>}
      </label>
      <div className={'flex flex-col gap-3'}>
        {options.map((option) => (
          <label
            key={option.value}
            className={`flex items-start p-4 rounded-special-small shadow-lg cursor-pointer transition-all border-2
              ${checked === option.value ? 'bg-primary text-white border-primary' : 'bg-white border-transparent hover:border-primary'}`}
          >
            <input
              type={'radio'}
              name={name}
              value={option.value}
              checked={checked === option.value}
              onChange={(e) => handleChange(e.target.name, e.target.value)}
              className={'w-5 h-5 mr-3 mt-1 cursor-pointer flex-shrink-0'}
            />
            <div className={'flex flex-col'}>
              <span className={'font-bold mb-1'}>{option.label}</span>
              <span
                className={`text-xs ${checked === option.value ? 'text-white opacity-80' : 'text-gray-500'}`}
              >
                {option.description}
              </span>
            </div>
          </label>
        ))}
      </div>
    </div>
  )
}
