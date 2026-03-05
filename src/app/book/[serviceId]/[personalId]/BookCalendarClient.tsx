'use client'
import type { ISlotService } from '../../fetch/slotsService'

import { format, formatISO, parseISO } from 'date-fns'
import dynamic from 'next/dynamic'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'

import { createSlotReservation, deleteSlotReservation } from '../../fetch/slotReservation'

const BookDatePicker = dynamic(() => import('./components/DatePicker'), {
  ssr: false,
  loading: () => <p className={'text-center'}>{'Loading calendar...'}</p>,
})
const EmptyAlert = dynamic(() => import('./components/EmptyAlert'), { ssr: false })
const TimePicker = dynamic(() => import('./components/TimePicker'), { ssr: false })

const NOONA_COMPANY_ID = process.env.NOONA_COMPANY_ID || ''

interface BookCalendarClientProps {
  initialData: {
    executeDateStrings: string[]
    filteredData: ISlotService[]
  }
}

export default function BookCalendarClient({ initialData }: BookCalendarClientProps) {
  const params = useParams()
  const serviceId = params?.serviceId as string
  const router = useRouter()

  const data = useMemo(
    () => ({
      executeDate: initialData.executeDateStrings.map((d) => parseISO(d)),
      filteredData: initialData.filteredData,
    }),
    [initialData],
  )

  const [slots, setSlots] = useState<{ employeeIds: string[]; time: string }[]>([])
  const [selected, setSelected] = useState<Date | null>(new Date())
  const [loadingTimepicker, setLoadingTimepicker] = useState<string>('')

  useEffect(() => {
    const idReservation = localStorage.getItem('idSlotReservation') || null
    if (idReservation) {
      deleteSlotReservation(idReservation).catch(() => {})
      localStorage.removeItem('idSlotReservation')
    }
  }, [])

  useEffect(() => {
    if (selected) {
      const selectDate = format(selected, 'yyyy-MM-dd')
      const filterSlots = data.filteredData.find((item) => item.date === selectDate)
      setSlots(filterSlots?.slots || [])
    }
  }, [data, selected])

  const selectDate = (value: Date | null) => {
    if (!value) return
    setSelected(value)
  }

  const handleSelect = async (employeeId: string, time: string) => {
    setLoadingTimepicker(time)
    try {
      if (!time || !selected) throw new Error('Invalid input')

      const [hours, minutes] = time.split(':').map(Number)
      selected.setHours(hours, minutes, 0, 0)

      const slotRezervation = await createSlotReservation({
        company: NOONA_COMPANY_ID,
        event_types: [serviceId],
        starts_at: formatISO(selected),
        employee: employeeId,
      })
      router.push(`/book/reservation/${slotRezervation.id}`)
      setLoadingTimepicker('')
    } catch (error) {
      setLoadingTimepicker('')
      console.error('Slot reservation error:', error)
    }
  }

  return (
    <div className={'bg-[#252523] rounded-special-small px-7.5 py-5'}>
      <BookDatePicker data={data.executeDate} selected={selected as Date} selectDate={selectDate} />
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
