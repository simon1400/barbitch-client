'use client'

import type { IEventReqData } from '../../fetch/createEvent'

import Button from 'components/Button'
import { Container } from 'components/Container'
import { format } from 'date-fns'
import { useParams, useRouter } from 'next/navigation'
import { useCallback, useEffect, useMemo, useState } from 'react'

import { createEvent } from '../../fetch/createEvent'
import { getSlotReservation } from '../../fetch/slotReservation'

import { UserData } from './components/UserData'

export interface IUserData {
  name: string
  phone: string
  email: string
  checkComent: boolean
  comment: string
}

const BookServicePage = () => {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const router = useRouter()
  const { idReservation } = useParams() as { idReservation: string }

  const [userData, setUserData] = useState<IUserData>({
    name: '',
    phone: '',
    email: '',
    checkComent: false,
    comment: '',
  })

  const handleChange = useCallback((name: string, value: string | boolean) => {
    setUserData((prev) => ({ ...prev, [name]: value }))
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const reservationData = await getSlotReservation(idReservation)
        setData(reservationData)
      } catch (err) {
        console.error('Ошибка при загрузке данных:', err) // Логируем ошибку
        setError('Ошибка загрузки данных')
      } finally {
        setLoading(false)
      }
    }

    if (idReservation) {
      fetchData()
    }
  }, [idReservation])

  const handleBook = async (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault()
    try {
      const dataSend: IEventReqData = {
        time_slot_reservation: idReservation,
        customer_name: userData.name,
        number_of_guests: 1,
        email: userData.email,
        phone_country_code: userData.phone.startsWith('+') ? userData.phone.slice(0, 4) : '+420',
        phone_number: userData.phone.replace(/^\+\d{3}/, ''),
        comment: userData.comment,
      }

      await createEvent(dataSend)
      router.push('/thank-you')
    } catch (err) {
      console.error('Ошибка бронирования:', err)
    }
  }

  const formattedData = useMemo(() => {
    if (!data) return null
    const eventType = data.event_types[0]

    return {
      date: format(data.starts_at, 'd.M.yyyy HH:mm'),
      duration: `${eventType.minutes} min`,
      employee: data.employee.profile.name,
      service: eventType.title,
      price: `${eventType.payments.total_payment} Kč`,
    }
  }, [data])

  if (loading) return <p className={'text-white'}>{'Загрузка...'}</p>
  if (error) return <p className={'text-red-500'}>{error}</p>
  if (!formattedData) return null

  return (
    <>
      <div
        className={'bg-[#252523] rounded-special-small px-5 pt-3.5 pb-2 text-[14px]/[17px] mb-5'}
      >
        <ul>
          {[
            { label: 'Datum', value: formattedData.date },
            { label: 'Trvání', value: formattedData.duration },
            { label: 'Zaměstnanec', value: formattedData.employee },
            { label: 'Služba', value: formattedData.service },
            { label: 'Celková cena', value: formattedData.price },
          ].map(({ label, value }) => (
            <li
              key={label}
              className={
                'py-2.5 flex justify-between border-t-2 border-dotted border-[#3C3C3C] first:border-t-0'
              }
            >
              <span className={'text-[#A0A0A0]'}>{label}</span>
              <span className={'text-white'}>{value}</span>
            </li>
          ))}
        </ul>
      </div>

      <UserData userData={userData} handleChange={handleChange} />

      <div className={'bg-[#252523] rounded-special-small px-5 py-3.5 mb-5'}>
        <div className={'max-w-[270px] mx-auto'}>
          <h3 className={'text-[#FFFFFFBF] text-[16px] mb-3.5'}>{'Storno podmínky'}</h3>
          <p className={'text-[#FFFFFF99] text-xss font-normal'}>
            {'Vezměte prosím na vědomí, že schůzky lze zrušit pouze s tříhodinovým předstihem.'}
          </p>
        </div>
      </div>

      <div
        className={
          'fixed flex items-center bottom-0 left-0 w-full h-[70px] bg-[#252523] shadow-default-level4'
        }
      >
        <Container size={'sm'} className={'text-right'}>
          <Button
            text={'POTVRDIT REZERVACI'}
            inverse
            small
            href={'/thank-you'}
            onClick={handleBook}
          />
        </Container>
      </div>
    </>
  )
}

export default BookServicePage
