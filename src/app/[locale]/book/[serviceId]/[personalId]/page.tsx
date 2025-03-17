'use client'

import type { NextPage } from 'next'
import type { ISlotService } from '../../fetch/slotsService'
import { format } from 'date-fns'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

import { createSlotReservation } from '../../fetch/slotReservation'
import { getSlotService } from '../../fetch/slotsService'

import { BookDatePicker } from './components/DatePicker'
import { EmptyAlert } from './components/EmptyAlert'
import { TimePicker } from './components/TimePicker'

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

  useEffect(() => {
    fetchData()
  }, [])

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

      selected.setHours(hours + 1, minutes, 0, 0)

      // Получаем смещение часового пояса в минутах
      const offsetMinutes = selected.getTimezoneOffset()
      const offsetHours = Math.abs(offsetMinutes / 60)
      const offsetSign = offsetMinutes > 0 ? '-' : '+'

      const formattedOffset = `${offsetSign}${String(offsetHours).padStart(2, '0')}:00`

      const result = selected.toISOString().replace('Z', formattedOffset)

      const slotRezervation = await createSlotReservation({
        company: '8qcJwRg6dbNh6Gqvm',
        event_types: [serviceId],
        number_of_guests: 1,
        starts_at: result,
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
        <p>{'Загрузка...'}</p>
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
