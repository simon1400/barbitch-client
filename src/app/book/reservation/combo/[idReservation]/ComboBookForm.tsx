'use client'
import Button from 'components/Button'
import { Container } from 'components/Container'
import { formatInTimeZone } from 'date-fns-tz'
import { useOnMountUnsafe } from 'helpers/useOnMountUnsaf'
import { useRouter } from 'next/navigation'
import { useCallback, useMemo, useState } from 'react'

import { getComboServiceById } from '../../../fetch/comboService'
import { createEvent } from '../../../fetch/createEvent'
import { getSlotReservation } from '../../../fetch/slotReservation'
import { UserData } from '../../[idReservation]/components/UserData'

export interface IUserData {
  name: string
  phone: string
  email: string
  checkComent: boolean
  comment: string
}

export interface IErrorUserData {
  name: boolean
  phone: boolean
  email: boolean
}

const ComboBookForm = () => {
  const router = useRouter()

  const [userData, setUserData] = useState<IUserData>({
    name: '',
    phone: '',
    email: '',
    checkComent: false,
    comment: '',
  })

  const [errorData, setErrorData] = useState<IErrorUserData>({
    name: false,
    phone: false,
    email: false,
  })

  const [reservationIds, setReservationIds] = useState<string[]>([])
  const [reservationsData, setReservationsData] = useState<any[]>([])
  const [comboService, setComboService] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useOnMountUnsafe(() => {
    const loadReservations = async () => {
      try {
        // Получаем все ID резерваций из localStorage
        const storedIds = localStorage.getItem('comboReservationIds')
        const comboId = localStorage.getItem('comboId')

        if (!storedIds || !comboId) {
          console.error('Резервации не найдены')
          return
        }

        const ids = JSON.parse(storedIds) as string[]
        setReservationIds(ids)

        // Получаем данные комбо-услуги
        const combo = getComboServiceById(comboId)
        setComboService(combo)

        // Загружаем данные всех резерваций
        const reservations = await Promise.all(ids.map((id) => getSlotReservation(id)))
        setReservationsData(reservations)
      } catch (error) {
        console.error('Ошибка загрузки резерваций:', error)
      } finally {
        setLoading(false)
      }
    }

    loadReservations()
  })

  const handleChange = useCallback((name: string, value: string | boolean) => {
    setUserData((prev) => ({ ...prev, [name]: value }))
    setErrorData((prev) => ({ ...prev, [name]: false }))
  }, [])

  const phoneData = useMemo(() => {
    const defaultCountryCode = '+420'
    return {
      phone_country_code: userData.phone.startsWith('+')
        ? userData.phone.slice(0, 4)
        : defaultCountryCode,
      phone_number: userData.phone.replace(/^\+\d{3}/, ''),
    }
  }, [userData.phone])

  const handleBook = async (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault()

    const errors: Partial<IErrorUserData> = {}

    if (!userData.name.length) errors.name = true
    if (userData.phone.length < 9) errors.phone = true
    if (!userData.email.includes('@')) errors.email = true

    if (Object.keys(errors).length) {
      setErrorData((prev) => ({ ...prev, ...errors }))
      return
    }

    try {
      // Формируем автоматический комментарий о комплексной услуге
      const comboComment = `Kombinovaný balíček: ${comboService?.title || 'Balíček služeb'}. Celková cena balíčku: ${comboService?.price || 0} Kč.`
      const fullComment = userData.comment
        ? `${comboComment}\n\nZákaznická poznámka: ${userData.comment}`
        : comboComment

      // Создаём события для всех резерваций с общим комментарием
      await Promise.all(
        reservationIds.map((id, index) =>
          createEvent({
            time_slot_reservation: id,
            customer_name: userData.name,
            number_of_guests: 1,
            no_show_acknowledged: true,
            email: userData.email,
            origin: 'online',
            channel: 'google maps',
            source: 'quick bookings',
            phone_country_code: phoneData.phone_country_code,
            phone_number: phoneData.phone_number,
            comment: `${fullComment}\n\nSlužba ${index + 1} z ${reservationIds.length} v komplexu.`,
          }),
        ),
      )

      // Очищаем localStorage
      localStorage.removeItem('comboReservationIds')
      localStorage.removeItem('comboId')

      router.push('/thank-you')
    } catch (err) {
      console.error('Chyba při rezervaci:', err)
    }
  }

  if (loading) {
    return (
      <div className={'bg-[#252523] rounded-special-small px-5 pt-3.5 pb-2 mb-5'}>
        <p className={'text-center'}>{'Načítání...'}</p>
      </div>
    )
  }

  return (
    <>
      <div
        className={'bg-[#252523] rounded-special-small px-5 pt-3.5 pb-2 text-[14px]/[17px] mb-5'}
      >
        <h3 className={'text-white text-[16px] mb-3'}>
          {comboService?.title || 'Kombinovaný balíček'}
        </h3>
        <ul>
          {reservationsData.map((reservation, index) => {
            const eventType = reservation.event_types?.[0]
            return (
              <li
                key={reservation.employee?.profile.name + reservation.id}
                className={`py-2.5 ${index > 0 ? 'border-t border-dotted border-[#3C3C3C]' : ''}`}
              >
                <div className={'flex justify-between mb-1'}>
                  <span className={'text-[#A0A0A0]'}>{`Služba ${index + 1}`}</span>
                  <span className={'text-white'}>{eventType?.title}</span>
                </div>
                <div className={'flex justify-between mb-1'}>
                  <span className={'text-[#A0A0A0]'}>{'Čas'}</span>
                  <span className={'text-white'}>
                    {formatInTimeZone(new Date(reservation.starts_at), 'Europe/Prague', 'HH:mm')}
                  </span>
                </div>
                <div className={'flex justify-between mb-1'}>
                  <span className={'text-[#A0A0A0]'}>{'Mistr'}</span>
                  <span className={'text-white'}>
                    {reservation.employee?.profile.name ?? 'Neznámý'}
                  </span>
                </div>
                <div className={'flex justify-between'}>
                  <span className={'text-[#A0A0A0]'}>{'Trvání'}</span>
                  <span className={'text-white'}>{`${eventType?.minutes} min`}</span>
                </div>
              </li>
            )
          })}
          <li className={'border-t-2 border-b-2 border-dotted border-[#3C3C3C] py-5 mt-2.5'}>
            <div className={'flex justify-between'}>
              <span className={'text-[#A0A0A0]'}>{'Datum'}</span>
              <span className={'text-white'}>
                {formatInTimeZone(
                  new Date(reservationsData[0]?.starts_at),
                  'Europe/Prague',
                  'd.M.yyyy',
                )}
              </span>
            </div>
          </li>
          <li className={'py-5'}>
            <div className={'flex justify-between'}>
              <span className={'text-[#A0A0A0]'}>{'Celková cena'}</span>
              <span className={'text-white font-bold'}>{`${comboService?.price ?? 'N/A'} Kč`}</span>
            </div>
          </li>
          <li className={`text-[11px]`}>
            <span className={'text-[#A0A0A0]'}>{'Platba - hotově nebo kartou na pobočce'}</span>
          </li>
        </ul>
      </div>

      <UserData userData={userData} handleChange={handleChange} errorData={errorData} />

      <div className={'bg-[#252523] rounded-special-small px-5 py-3.5 mb-5'}>
        <div className={'max-w-[270px] mx-auto'}>
          <h3 className={'text-[#FFFFFFBF] text-[16px] mb-3.5'}>{'Storno podmínky'}</h3>
          <p className={'text-[#FFFFFF99] text-xss font-normal'}>
            {'Vezměte prosím na vědomí, že schůzky lze zrušit pouze s tříhodinovým předstihem.'}
          </p>
        </div>
      </div>

      <div
        className={'fixed flex items-center bottom-0 left-0 w-full h-[70px]'}
        style={{ backgroundImage: 'linear-gradient(180deg, #16161500 0%, #161615 100%)' }}
      >
        <Container size={'sm'} className={'text-center'}>
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

export default ComboBookForm
