import type { IUserData } from '../page'

export const Input = ({
  label,
  data,
  name,
  handleChange,
}: {
  label: string
  data: IUserData
  name: 'name' | 'phone' | 'email'
  handleChange: (name: string, value: string) => void
}) => {
  return (
    <div className={'mb-3'}>
      <label className={'text-[#A0A0A0] text-book font-medium mb-1'}>{label}</label>
      <input
        className={
          'bg-[#161615] border block w-full border-[#4A4A4A] rounded-special-small text-book text-white h-10 px-3.5'
        }
        type={'text'}
        value={data[name]}
        onChange={(e) => handleChange(name, e.target.value)}
      />
    </div>
  )
}
