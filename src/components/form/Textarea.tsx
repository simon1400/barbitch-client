export const Textarea = ({
  name,
  label,
  value,
  handleChange,
}: {
  name: string
  label: string
  value: string
  handleChange: (name: string, value: string) => void
}) => {
  return (
    <div className={'mb-5'}>
      <label className={'font-bold mb-2 block'} htmlFor={''}>
        {label}
      </label>
      <textarea
        className={
          'w-full h-40 rounded-special-small shadow-lg bg-white p-5 outline-primary resize-none'
        }
        name={name}
        value={value}
        onChange={(e) => handleChange(e.target.name, e.target.value)}
      />
    </div>
  )
}
