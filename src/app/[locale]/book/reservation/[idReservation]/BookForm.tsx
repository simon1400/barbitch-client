'use client'

import Button from 'components/Button'
import { Container } from 'components/Container'
import { useRouter } from 'next/navigation'
import { useCallback, useMemo, useState } from 'react'

import { createEvent } from '../../fetch/createEvent'

import { UserData } from './components/UserData'

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

interface Props {
  idReservation: string
}

const BookForm = ({ idReservation }: Props) => {
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
      await createEvent({
        time_slot_reservation: idReservation,
        customer_name: userData.name,
        number_of_guests: 1,
        email: userData.email,
        phone_country_code: phoneData.phone_country_code,
        phone_number: phoneData.phone_number,
        comment: userData.comment,
      })

      router.push('/thank-you')
    } catch (err) {
      console.error('Ошибка бронирования:', err)
    }
  }

  return (
    <>
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

export default BookForm
