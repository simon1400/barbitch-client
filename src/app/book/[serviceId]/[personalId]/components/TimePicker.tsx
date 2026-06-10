'use client'
import type { EmployeeLoad, IMasterPriority } from '../../../fetch/masterPriority'
import type { IBlockSlots } from './TimeBlock'

import { parse } from 'date-fns'
import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
const TimeBlock = dynamic(() => import('./TimeBlock'), { ssr: false })

const TimePicker = ({
  slots,
  handleSelect,
  loadingTimepicker,
  masterPriorities,
  employeeLoad,
  selectedDate,
}: {
  loadingTimepicker: string
  slots: { employeeIds: string[]; time: string }[]
  handleSelect: (employeeIds: string, time: string) => void
  masterPriorities: IMasterPriority[]
  employeeLoad: EmployeeLoad
  selectedDate: Date
}) => {
  const [morning, setMorning] = useState<IBlockSlots[]>([])
  const [afternoon, setAfternoon] = useState<IBlockSlots[]>([])

  useEffect(() => {
    const filteredBefore12 = slots.filter((item) => {
      const time = parse(item.time, 'HH:mm', new Date())
      return time.getHours() < 12
    })
    const filteredAfter12 = slots.filter((item) => {
      const time = parse(item.time, 'HH:mm', new Date())
      return time.getHours() >= 12
    })
    setMorning(filteredBefore12)
    setAfternoon(filteredAfter12)
  }, [slots])

  return (
    <div className={'flex gap-3 max-w-[266px] mx-auto text-center pt-5'}>
      <TimeBlock
        head={'dopoledne'}
        blockSlots={morning}
        handleSelect={handleSelect}
        loadingTimepicker={loadingTimepicker}
        masterPriorities={masterPriorities}
        employeeLoad={employeeLoad}
        selectedDate={selectedDate}
      />
      <TimeBlock
        head={'odpoledne'}
        blockSlots={afternoon}
        handleSelect={handleSelect}
        loadingTimepicker={loadingTimepicker}
        masterPriorities={masterPriorities}
        employeeLoad={employeeLoad}
        selectedDate={selectedDate}
      />
    </div>
  )
}

export default TimePicker
