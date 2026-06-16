'use client'
import Button from 'components/Button'
import { Container } from 'components/Container'
import { sendGoogleAdsConversion } from 'fetch/googleAds'
import { sendCAPIEvent } from 'fetch/pixel'
import { useOnMountUnsafe } from 'helpers/useOnMountUnsaf'
import { useRouter } from 'next/navigation'
import { useCallback, useMemo, useState } from 'react'

import { useBookReservation } from '../../components/BookReservationContext'
import { checkBlacklist } from '../../fetch/checkBlacklist'
import { BlacklistError, createEvent } from '../../fetch/createEvent'

import { UserData } from './components/UserData'

export interface IUserData {
  name: string
  phone: string
  email: string
  checkComent: boolean
  comment: string
  gdprConsent: boolean
}

export interface IErrorUserData {
  name: boolean
  phone: boolean
  email: boolean
  gdprConsent: boolean
}

interface Props {
  idReservation: string
}

// Атрибуция e-mail-предложения «дозапись в окно»: если клиент пришёл по ссылке из
// письма (метка bb_offer в localStorage, не старше 6ч) — дописываем в комментарий брони
// Noona источник + скидку, чтобы мастер применил её. Метку очищаем после использования.
const applyOfferAttribution = (userComment: string): string => {
  try {
    const raw = localStorage.getItem('bb_offer')
    if (!raw) return userComment
    localStorage.removeItem('bb_offer')
    const o = JSON.parse(raw) as { src?: string; disc?: string; ts?: number }
    if (o?.src !== 'win' || Date.now() - (o.ts || 0) >= 6 * 60 * 60 * 1000) return userComment
    const sleva = o.disc ? `sleva ${o.disc} %` : 'sleva'
    const tag = `📧 Dozápis z e-mailu · ${sleva} — uplatnit při platbě`
    return userComment ? `${tag}\n${userComment}` : tag
  } catch {
    return userComment
  }
}

const BookForm = ({ idReservation }: Props) => {
  const router = useRouter()
  const { expiredId } = useBookReservation()
  const isExpired = expiredId === idReservation

  const [userData, setUserData] = useState<IUserData>({
    name: '',
    phone: '',
    email: '',
    checkComent: false,
    comment: '',
    gdprConsent: false,
  })

  const [errorData, setErrorData] = useState<IErrorUserData>({
    name: false,
    phone: false,
    email: false,
    gdprConsent: false,
  })

  useOnMountUnsafe(() => {
    localStorage.setItem('idSlotReservation', idReservation)
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

    // Слот уже не удерживается — отправка создаст событие на истёкшую резервацию
    // (Noona вернёт 400/422, что код ошибочно трактует как блэклист → /blocked).
    if (isExpired) return

    const errors: Partial<IErrorUserData> = {}

    if (!userData.name.length) errors.name = true
    if (userData.phone.length < 9) errors.phone = true
    if (!userData.email.includes('@')) errors.email = true
    if (!userData.gdprConsent) errors.gdprConsent = true

    if (Object.keys(errors).length) {
      setErrorData((prev) => ({ ...prev, ...errors }))
      return
    }

    try {
      // Check blacklist before creating event
      const isBlacklisted = await checkBlacklist({
        email: userData.email,
        phone_number: phoneData.phone_number,
        phone_country_code: phoneData.phone_country_code,
      })

      // Create event even for blacklisted users - Noona will handle it
      await createEvent({
        time_slot_reservation: idReservation,
        customer_name: userData.name,
        number_of_guests: 1,
        no_show_acknowledged: true,
        email: userData.email,
        origin: 'online',
        channel: 'google maps',
        source: 'quick bookings',
        phone_country_code: phoneData.phone_country_code,
        phone_number: phoneData.phone_number,
        comment: applyOfferAttribution(userData.comment),
      })

      // If user is blacklisted, redirect to blocked page
      // Event is already created in Noona, it will handle it automatically
      if (isBlacklisted) {
        router.push('/blocked')
        return
      }

      // Send Lead event to FB CAPI
      sendCAPIEvent('Lead', {
        email: userData.email,
        phone: userData.phone,
      })

      // Send Lead conversion to Google Ads (Data Manager API)
      sendGoogleAdsConversion('Lead', {
        email: userData.email,
        phone: userData.phone,
      })

      router.push('/thank-you')
    } catch (err) {
      // Check if customer is blacklisted
      if (err instanceof BlacklistError) {
        router.push('/blocked')
        return
      }

      console.error('Booking error:', err)
    }
  }

  if (isExpired) {
    return (
      <div className={'bg-[#252523] rounded-special-small p-6 text-center'}>
        <p className={'text-white text-resMd1 mb-1'}>{'Rezervace vypršela'}</p>
        <p className={'text-[#A0A0A0] text-xss mb-5'}>
          {'Vyhrazený čas na dokončení rezervace vypršel. Vyberte prosím nový termín.'}
        </p>
        <Button
          text={'Zpět na výběr termínu'}
          href={'#'}
          inverse
          small
          onClick={(e) => {
            e.preventDefault()
            router.back()
          }}
        />
      </div>
    )
  }

  return (
    <>
      <UserData userData={userData} handleChange={handleChange} errorData={errorData} />

      <div className={'bg-[#252523] rounded-special-small px-5 py-3.5 mb-5'}>
        <div className={'max-w-[270px] mx-auto'}>
          <h3 className={'text-[#FFFFFFBF] text-[16px] mb-3.5'}>{'Storno podmínky'}</h3>
          <p className={'text-[#FFFFFF99] text-xss font-normal'}>
            {'Vezměte prosím na vědomí, že rezervace lze zrušit pouze s tříhodinovým předstihem.'}
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
