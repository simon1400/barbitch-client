import type { IUserData } from '../BookForm'

import { bookingFieldCls } from 'components/form/fieldStyles'

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
        className={`${bookingFieldCls(error)} h-10 px-3.5`}
        type={'text'}
        name={name}
        value={data[name]}
        onChange={(e) => handleChange(name, e.target.value)}
      />
    </div>
  )
}
