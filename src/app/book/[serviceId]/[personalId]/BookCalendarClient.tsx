'use client'
import type { EmployeeLoad, IMasterPriority } from '../../fetch/masterPriority'
import type { ISlotService } from '../../fetch/slotsService'

import { format, formatISO, parseISO } from 'date-fns'
import dynamic from 'next/dynamic'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'

import { createSlotReservation, deleteSlotReservation } from '../../fetch/slotReservation'

import { CalendarSkeletonInner } from './components/CalendarSkeleton'

const BookDatePicker = dynamic(() => import('./components/DatePicker'), {
  ssr: false,
  loading: () => <CalendarSkeletonInner />,
})
const EmptyAlert = dynamic(() => import('./components/EmptyAlert'), { ssr: false })
const TimePicker = dynamic(() => import('./components/TimePicker'), { ssr: false })

const NOONA_COMPANY_ID = process.env.NOONA_COMPANY_ID || ''

interface BookCalendarClientProps {
  initialData: {
    executeDateStrings: string[]
    filteredData: ISlotService[]
    masterPriorities: IMasterPriority[]
    employeeEventTypeMap: Record<string, string>
    employeeLoad: EmployeeLoad
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

    // Переход с e-mail-предложения «дозапись в окно»: метка для атрибуции (попадёт
    // в комментарий брони Noona) + предвыбор предложенной даты.
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

      // Если выбранный мастер — junior, бронируем его junior event_type (−20%),
      // иначе обычный serviceId из URL.
      const eventTypeId = initialData.employeeEventTypeMap[employeeId] || serviceId

      const slotRezervation = await createSlotReservation({
        company: NOONA_COMPANY_ID,
        event_types: [eventTypeId],
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
          masterPriorities={initialData.masterPriorities}
          employeeLoad={initialData.employeeLoad}
          selectedDate={selected as Date}
        />
      ) : (
        <EmptyAlert />
      )}
    </div>
  )
}
