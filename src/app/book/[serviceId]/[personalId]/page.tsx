'use client'
import type { NextPage } from 'next'
import type { ISlotService } from '../../fetch/slotsService'

import { format, formatISO } from 'date-fns'
import { useOnMountUnsafe } from 'helpers/useOnMountUnsaf'
import dynamic from 'next/dynamic'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

import { createSlotReservation } from '../../fetch/slotReservation'
import { getSlotService } from '../../fetch/slotsService'

const BookDatePicker = dynamic(() => import('./components/DatePicker'), {
  ssr: false,
  loading: () => <p className={'text-center'}>{'Loading calendar...'}</p>,
})
const EmptyAlert = dynamic(() => import('./components/EmptyAlert'), { ssr: false })
const TimePicker = dynamic(() => import('./components/TimePicker'), { ssr: false })

const NOONA_COMPANY_ID = process.env.NOONA_COMPANY_ID || ''

const BookCalendarPage: NextPage = () => {
  const params = useParams()
  const serviceId = params?.serviceId as string
  const personalId = params?.personalId as string

  const router = useRouter()

  const [data, setData] = useState<{ executeDate: Date[]; filteredData: ISlotService[] } | null>(
    null,
  )
  const [slots, setSlots] = useState<{ employeeIds: string[]; time: string }[]>([])
  const [selected, setSelected] = useState<Date | null>(new Date())
  const [loading, setLoading] = useState<boolean>(true)

  const handleFilterSlots = (
    data: { executeDate: Date[]; filteredData: ISlotService[] },
    value: Date,
  ) => {
    const selectDate = format(value, 'yyyy-MM-dd')
    const filterSlots = data.filteredData.find((item) => item.date === selectDate)
    setSlots(filterSlots?.slots || [])
  }

  const fetchData = async () => {
    if (!serviceId || !personalId) return
    setLoading(true)
    try {
      const res = await getSlotService(serviceId, personalId)
      setData(res)
    } catch (error) {
      console.error('Ошибка загрузки слотов:', error)
    } finally {
      setLoading(false)
    }
  }

  useOnMountUnsafe(() => {
    fetchData()
  })

  useEffect(() => {
    if (data && selected) {
      handleFilterSlots(data, selected)
    }
  }, [data, selected])

  const selectDate = (value: Date | null) => {
    if (!value) return
    setSelected(value)
  }

  const handleSelect = async (employeeId: string, time: string) => {
    try {
      if (!time || !selected) throw new Error('Неверные входные данные')

      const [hours, minutes] = time.split(':').map(Number)

      selected.setHours(hours, minutes, 0, 0)

      const slotRezervation = await createSlotReservation({
        company: NOONA_COMPANY_ID,
        event_types: [serviceId],
        starts_at: formatISO(selected),
        origin: 'online',
        channel: 'google maps',
        source: 'quick bookings',
        employee: employeeId,
      })
      router.push(`/book/reservation/${slotRezervation.id}`)
    } catch (error) {
      console.error('Ошибка бронирования слота:', error)
    }
  }

  return (
    <div className={'bg-[#252523] rounded-special-small px-7.5 py-5'}>
      {loading ? (
        <p className={'text-center'}>{'Loading calendar...'}</p>
      ) : (
        <>
          <BookDatePicker
            data={data?.executeDate || []}
            selected={selected as Date}
            selectDate={selectDate}
          />
          {slots.length ? <TimePicker slots={slots} handleSelect={handleSelect} /> : <EmptyAlert />}
        </>
      )}
    </div>
  )
}

export default BookCalendarPage
