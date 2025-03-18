import type { IUserData } from '../page'

export const Input = ({
  label,
  data,
  error = false,
  name,
  handleChange,
}: {
  label: string
  error?: boolean
  data: IUserData
  name: 'name' | 'phone' | 'email'
  handleChange: (name: string, value: string) => void
}) => {
  return (
    <div className={'mb-3'}>
      <label
        className={`${error ? 'text-[#E71E1E]' : 'text-[#A0A0A0]'} text-book font-medium mb-1`}
      >
        {label}
      </label>
      <input
        className={`bg-[#161615] border block w-full ${error ? 'border-[#E71E1E]' : 'border-[#4A4A4A]'} outline-none focus:border-[#929292] rounded-special-small text-book text-white h-10 px-3.5`}
        type={'text'}
        value={data[name]}
        onChange={(e) => handleChange(name, e.target.value)}
      />
    </div>
  )
}
