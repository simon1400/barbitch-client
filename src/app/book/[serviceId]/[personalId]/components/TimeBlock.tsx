import { LoaderCircle } from 'lucide-react'

export interface IBlockSlots {
  time: string
  employeeIds: string[]
}

const TimeBlock = ({
  head,
  blockSlots,
  handleSelect,
  loadingTimepicker,
}: {
  head: string
  blockSlots: IBlockSlots[]
  handleSelect: (employeeIds: string, time: string) => void
  loadingTimepicker: string
}) => {
  return (
    <div className={'flex flex-col gap-2.5 w-full'}>
      <span className={'text-[14px] text-[#FFFFFF99] block'}>{head}</span>
      {blockSlots.map((item) => (
        <span
          key={item.time}
          onClick={() => {
            if (!loadingTimepicker.length) {
              handleSelect(item.employeeIds[0], item.time)
            }
          }}
          className={`h-[38px] block w-full rounded-special-small text-white text-[14px]/[38px] duration-200  ${loadingTimepicker === item.time ? 'bg-primary' : 'bg-[#161615]'} ${!loadingTimepicker.length ? 'hover:bg-primary cursor-pointer' : 'cursor-progress'}`}
        >
          {loadingTimepicker === item.time ? (
            <span className={'flex items-center justify-center h-full'}>
              <LoaderCircle className={'animate-spin text-blue-500 w-6 h-6 stroke-white'} />
            </span>
          ) : (
            item.time
          )}
        </span>
      ))}
    </div>
  )
}

export default TimeBlock
