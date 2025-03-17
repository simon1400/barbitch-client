'use client'
import { parse } from 'date-fns'
import { useEffect, useState } from 'react'

export const TimePicker = ({
  slots,
  handleSelect,
}: {
  slots: { time: string }[]
  handleSelect: (time: string) => void
}) => {
  const [morning, setMorning] = useState<{ time: string }[]>([])
  const [afternoon, setAfternoon] = useState<{ time: string }[]>([])

  useEffect(() => {
    const filteredBefore12 = slots.filter((item) => {
      const time = parse(item.time, 'HH:mm', new Date()) // Преобразуем строку в дату
      return time.getHours() < 12 // Оставляем только время до 12:00
    })
    const filteredAfter12 = slots.filter((item) => {
      const time = parse(item.time, 'HH:mm', new Date())
      return time.getHours() >= 12 // Оставляем только время после 12:00
    })
    setMorning(filteredBefore12)
    setAfternoon(filteredAfter12)
  }, [slots])

  return (
    <div className={'flex gap-3 max-w-[266px] mx-auto text-center pt-5'}>
      <div className={'flex flex-col gap-2.5 w-full'}>
        <span className={'text-[14px] text-[#FFFFFF99] block'}>{'dopoledne'}</span>
        {morning.map((item) => (
          <span
            key={item.time}
            onClick={() => handleSelect(item.time)}
            className={
              'h-[38px] block mb- w-full bg-[#161615] rounded-special-small text-white text-[14px]/[38px] cursor-pointer hover:bg-primary duration-200'
            }
          >
            {item.time}
          </span>
        ))}
      </div>
      <div className={'flex flex-col gap-2.5 w-full'}>
        <span className={'text-[14px] text-[#FFFFFF99] block'}>{'odpoledne'}</span>
        {afternoon.map((item) => (
          <span
            key={item.time}
            onClick={() => handleSelect(item.time)}
            className={
              'h-[38px] block mb- w-full bg-[#161615] rounded-special-small text-white text-[14px]/[38px] cursor-pointer hover:bg-primary duration-200'
            }
          >
            {item.time}
          </span>
        ))}
      </div>
    </div>
  )
}
