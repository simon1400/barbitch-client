export const Checkbox = ({
  name,
  label,
  checked,
  handleChange,
}: {
  name: string
  label: string
  checked: boolean
  handleChange: (name: string, value: boolean) => void
}) => {
  return (
    <div className={'mb-5'}>
      <label className={'flex items-center cursor-pointer'}>
        <input
          type={'checkbox'}
          name={name}
          checked={checked}
          onChange={(e) => handleChange(e.target.name, e.target.checked)}
          className={'w-5 h-5 mr-3 cursor-pointer'}
        />
        <span className={'font-bold'}>{label}</span>
      </label>
    </div>
  )
}
