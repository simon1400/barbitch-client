'use client'
import type { IComboSlot } from '../../fetch/comboSlotsService'
import type { NextPage } from 'next'

import { format, formatISO } from 'date-fns'
import { useOnMountUnsafe } from 'helpers/useOnMountUnsaf'
import dynamic from 'next/dynamic'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

import { getComboServiceById } from '../../fetch/comboService'
import { getComboSlots } from '../../fetch/comboSlotsService'
import { createSlotReservation, deleteSlotReservation } from '../../fetch/slotReservation'

const BookDatePicker = dynamic(() => import('../../[serviceId]/[personalId]/components/DatePicker'), {
  ssr: false,
  loading: () => <p className={'text-center'}>{'Loading calendar...'}</p>,
})
const EmptyAlert = dynamic(() => import('../../[serviceId]/[personalId]/components/EmptyAlert'), { ssr: false })
const TimePicker = dynamic(() => import('../../[serviceId]/[personalId]/components/TimePicker'), { ssr: false })

const NOONA_COMPANY_ID = process.env.NOONA_COMPANY_ID || ''

const ComboBookingPage: NextPage = () => {
  const params = useParams()
  const comboId = params?.comboId as string
  const router = useRouter()

  const [data, setData] = useState<{ executeDate: Date[]; filteredData: IComboSlot[] } | null>(null)
  const [slots, setSlots] = useState<{ employeeIds: string[]; time: string }[]>([])
  const [selected, setSelected] = useState<Date | null>(new Date())
  const [loading, setLoading] = useState<boolean>(true)
  const [loadingTimepicker, setLoadingTimepicker] = useState<string>('')

  const comboService = getComboServiceById(comboId)

  const handleFilterSlots = (
    data: { executeDate: Date[]; filteredData: IComboSlot[] },
    value: Date,
  ) => {
    const selectDate = format(value, 'yyyy-MM-dd')
    const filterSlots = data.filteredData.find((item) => item.date === selectDate)

    // Преобразуем комбо-слоты в формат, понятный TimePicker
    const formattedSlots = filterSlots?.slots.map((slot) => ({
      time: slot.time,
      employeeIds: slot.services.map((s) => s.employeeId),
    })) || []

    setSlots(formattedSlots)
  }

  const fetchData = async () => {
    if (!comboService) {
      console.error('Комбо-услуга не найдена')
      return
    }

    setLoading(true)
    try {
      const res = await getComboSlots(comboService.services)
      setData(res)
    } catch (error) {
      console.error('Ошибка загрузки слотов:', error)
    } finally {
      setLoading(false)
    }
  }

  const controlReservationSlot = () => {
    const reservationIds = localStorage.getItem('comboReservationIds')
    if (reservationIds) {
      const ids = JSON.parse(reservationIds) as string[]
      // Удаляем все старые резервации
      Promise.all(ids.map((id) => deleteSlotReservation(id)))
        .then(() => {
          localStorage.removeItem('comboReservationIds')
        })
        .catch((err) => console.error('Ошибка удаления резерваций:', err))
    }
  }

  useOnMountUnsafe(() => {
    fetchData()
    controlReservationSlot()
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
    if (!comboService || !selected || !data) return

    setLoadingTimepicker(time)

    try {
      const selectDate = format(selected, 'yyyy-MM-dd')
      const comboSlot = data.filteredData
        .find((item) => item.date === selectDate)
        ?.slots.find((slot) => slot.time === time)

      if (!comboSlot) {
        throw new Error('Слот не найден')
      }

      // Создаём резервации для всех услуг последовательно
      const reservationIds: string[] = []

      for (const service of comboSlot.services) {
        const [hours, minutes] = service.startTime.split(':').map(Number)
        const serviceDate = new Date(selected)
        serviceDate.setHours(hours, minutes, 0, 0)

        const reservation = await createSlotReservation({
          company: NOONA_COMPANY_ID,
          event_types: [service.serviceId],
          starts_at: formatISO(serviceDate),
          employee: service.employeeId,
        })

        reservationIds.push(reservation.id)
      }

      // Сохраняем все ID резерваций
      localStorage.setItem('comboReservationIds', JSON.stringify(reservationIds))
      localStorage.setItem('comboId', comboId)

      // Переходим на страницу подтверждения (используем ID первой резервации)
      router.push(`/book/reservation/combo/${reservationIds[0]}`)

      setLoadingTimepicker('')
    } catch (error) {
      setLoadingTimepicker('')
      console.error('Ошибка бронирования комбо-слота:', error)
    }
  }

  if (!comboService) {
    return (
      <div className={'bg-[#252523] rounded-special-small px-7.5 py-5'}>
        <p className={'text-center text-red-500'}>{'Комбо-услуга не найдена'}</p>
      </div>
    )
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
          {slots.length ? (
            <TimePicker
              slots={slots}
              handleSelect={handleSelect}
              loadingTimepicker={loadingTimepicker}
            />
          ) : (
            <EmptyAlert />
          )}
        </>
      )}
    </div>
  )
}

export default ComboBookingPage
