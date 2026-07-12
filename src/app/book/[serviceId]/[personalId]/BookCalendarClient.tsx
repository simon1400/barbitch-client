'use client'
import type { ISelection } from '../../fetch/engine'

import { format, parseISO } from 'date-fns'
import dynamic from 'next/dynamic'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'

import { createEngineHold, engineErrorCode } from '../../fetch/engine'

import { CalendarSkeletonInner } from './components/CalendarSkeleton'

const BookDatePicker = dynamic(() => import('./components/DatePicker'), {
  ssr: false,
  loading: () => <CalendarSkeletonInner />,
})
const EmptyAlert = dynamic(() => import('./components/EmptyAlert'), { ssr: false })
const TimePicker = dynamic(() => import('./components/TimePicker'), { ssr: false })

export interface ISlotDay {
  date: string
  slots: { time: string }[]
}

interface BookCalendarClientProps {
  initialData: {
    executeDateStrings: string[]
    filteredData: ISlotDay[]
    selection: ISelection
  }
}

export default function BookCalendarClient({ initialData }: BookCalendarClientProps) {
  const params = useParams()
  const serviceId = params?.serviceId as string
  const personalId = params?.personalId as string
  const router = useRouter()

  const excludeDates = useMemo(
    () => initialData.executeDateStrings.map((d) => parseISO(d)),
    [initialData],
  )

  const [slots, setSlots] = useState<{ time: string }[]>([])
  const [selected, setSelected] = useState<Date | null>(new Date())
  const [loadingTimepicker, setLoadingTimepicker] = useState<string>('')
  const [slotError, setSlotError] = useState<string>('')

  useEffect(() => {
    // Переход с e-mail-предложения «дозапись в окно»: метка для атрибуции (попадёт
    // в комментарий брони) + предвыбор предложенной даты.
    try {
      const p = new URLSearchParams(window.location.search)
      if (p.get('src') === 'win') {
        localStorage.setItem(
          'bb_offer',
          JSON.stringify({ src: 'win', disc: p.get('disc') || '', ts: Date.now() }),
        )
      }
      const d = p.get('d')
      if (d && /^\d{4}-\d{2}-\d{2}$/.test(d)) {
        const dt = parseISO(d)
        if (!Number.isNaN(dt.getTime())) setSelected(dt)
      }
    } catch {
      /* no-op */
    }
  }, [])

  useEffect(() => {
    if (selected) {
      const selectDate = format(selected, 'yyyy-MM-dd')
      const filterSlots = initialData.filteredData.find((item) => item.date === selectDate)
      setSlots(filterSlots?.slots || [])
    }
  }, [initialData, selected])

  const selectDate = (value: Date | null) => {
    if (!value) return
    setSlotError('')
    setSelected(value)
  }

  const handleSelect = async (time: string) => {
    if (!time || !selected) return
    setLoadingTimepicker(time)
    setSlotError('')
    try {
      // Холд на 5 минут; для 'any' конкретного мастера выберет движок (балансировка).
      const hold = await createEngineHold({
        service: serviceId,
        selection: initialData.selection,
        employee: personalId,
        date: format(selected, 'yyyy-MM-dd'),
        time,
      })
      router.push(`/book/reservation/${hold.holdId}`)
      setLoadingTimepicker('')
    } catch (error) {
      setLoadingTimepicker('')
      if (engineErrorCode(error) === 'slot_taken') {
        // Слот заняли, пока клиент выбирал — обновляем доступность с сервера.
        setSlotError('Tento termín byl právě obsazen. Vyberte prosím jiný čas.')
        router.refresh()
        return
      }
      setSlotError('Rezervaci se nepodařilo vytvořit. Zkuste to prosím znovu.')
      console.error('Slot hold error:', error)
    }
  }

  return (
    <div className={'bg-[#252523] rounded-special-small px-7.5 py-5'}>
      <BookDatePicker data={excludeDates} selected={selected as Date} selectDate={selectDate} />
      {slotError && <p className={'text-[#E71E6E] text-xss text-center pt-3'}>{slotError}</p>}
      {slots.length ? (
        <TimePicker
          slots={slots}
          handleSelect={handleSelect}
          loadingTimepicker={loadingTimepicker}
        />
      ) : (
        <EmptyAlert />
      )}
    </div>
  )
}
