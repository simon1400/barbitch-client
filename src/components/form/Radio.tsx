const vouchers = ['500', '1000', '1500', '2000'] // --- free

export const Radio = ({
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
  return (
    <div className={'mb-5'}>
      <label className={'font-bold mb-2 block'}>
        {label}
        {required && <span className={'text-primary'}>{' *'}</span>}
      </label>
      <div className={'grid grid-cols-5 gap-2 md:gap-5'}>
        {vouchers.map((item) => (
          <div
            className={`h-13 rounded-special-small shadow-lg justify-center flex items-center cursor-pointer hover:border border-primary 
              ${checked === item ? 'bg-primary text-white' : 'bg-white'}`}
            key={item}
            onClick={() => handleChange(name, item)}
          >
            <span className={'font-bold text-center'}>
              {item} {'Kč'}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
