'use client'
import Button from 'components/Button'
import { Container } from 'components/Container'
import { sendGoogleAdsConversion } from 'fetch/googleAds'
import { sendCAPIEvent } from 'fetch/pixel'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'

import { getCabinetJwt, getCabinetMe } from '../../../cabinet/fetch/cabinetApi'
import { useBookReservation } from '../../components/BookReservationContext'
import { createEngineBooking, engineErrorCode, THANK_YOU_STORAGE_KEY } from '../../fetch/engine'

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
// источник + скидку, чтобы мастер применил её. Метку очищаем после использования.
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
  const { expiredId, setExpiredId } = useBookReservation()
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

  const [submitError, setSubmitError] = useState<string>('')
  // Имя залогиненного клиента — если есть, данные подставлены из профиля кабинета
  const [accountName, setAccountName] = useState<string | null>(null)

  // Автозаполнение из личного кабинета: если клиент залогинен (client-JWT в
  // localStorage), тянем профиль и подставляем имя/телефон/e-mail. Поля остаются
  // редактируемыми (бронь для другого человека). Невалидный/просроченный JWT —
  // тихо игнорируем. GDPR-согласие НЕ пред-заполняем (должно быть активным).
  useEffect(() => {
    if (!getCabinetJwt()) return
    let cancelled = false
    getCabinetMe()
      .then((me) => {
        if (cancelled) return
        setUserData((prev) => ({
          ...prev,
          name: prev.name || me.name || '',
          phone: prev.phone || me.phone || '',
          email: prev.email || me.email || '',
        }))
        setAccountName(me.name || null)
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [])

  const handleChange = useCallback((name: string, value: string | boolean) => {
    setUserData((prev) => ({ ...prev, [name]: value }))
    setErrorData((prev) => ({ ...prev, [name]: false }))
  }, [])

  const handleBook = async (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault()

    // Холд уже истёк — движок бронь не примет, не отправляем.
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

    setSubmitError('')
    try {
      // Блэклист проверяет сервер (403 blacklisted) — клиентского чека больше нет.
      const booking = await createEngineBooking({
        holdId: idReservation,
        name: userData.name,
        phone: userData.phone,
        email: userData.email,
        customerComment: applyOfferAttribution(userData.comment),
      })

      // Данные брони для /thank-you (бейдж времени + предложения дозаписи по cancelToken).
      // sessionStorage: живёт только в этой вкладке, thank-you сам отсеет устаревшее.
      try {
        sessionStorage.setItem(
          THANK_YOU_STORAGE_KEY,
          JSON.stringify({
            cancelToken: booking.cancelToken,
            date: booking.date,
            time: booking.time,
            ts: Date.now(),
          }),
        )
      } catch {
        // приватный режим/квоты — thank-you просто покажет обычный экран
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
      const code = engineErrorCode(err)
      if (code === 'blacklisted') {
        router.push('/blocked')
        return
      }
      if (code === 'hold_expired' || code === 'hold_not_found') {
        setExpiredId(idReservation)
        return
      }
      if (code === 'slot_taken') {
        setSubmitError('Termín byl bohužel právě obsazen. Vyberte prosím jiný čas.')
        return
      }
      setSubmitError('Rezervaci se nepodařilo vytvořit. Zkuste to prosím znovu.')
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
      {accountName && (
        <div
          className={
            'bg-[#252523] border border-[#4a2a3a] rounded-special-small px-5 py-3 mb-5 flex items-center gap-2.5'
          }
        >
          <svg width={16} height={16} viewBox={'0 0 24 24'} fill={'none'} aria-hidden>
            <path
              d={'M4.5 12.5l4.5 4.5L19.5 6.5'}
              stroke={'#E71E6E'}
              strokeWidth={2.2}
              strokeLinecap={'round'}
              strokeLinejoin={'round'}
            />
          </svg>
          <span className={'text-xss text-[#A0A0A0]'}>
            {'Údaje vyplněny z účtu '}
            <span className={'text-white'}>{accountName}</span>
            {'. Můžete je upravit.'}
          </span>
        </div>
      )}

      <UserData userData={userData} handleChange={handleChange} errorData={errorData} />

      <div className={'bg-[#252523] rounded-special-small px-5 py-3.5 mb-5'}>
        <div className={'max-w-[270px] mx-auto'}>
          <h3 className={'text-[#FFFFFFBF] text-[16px] mb-3.5'}>{'Storno podmínky'}</h3>
          <p className={'text-[#FFFFFF99] text-xss font-normal'}>
            {'Vezměte prosím na vědomí, že rezervace lze zrušit pouze s tříhodinovým předstihem.'}
          </p>
        </div>
      </div>

      {submitError && <p className={'text-[#E71E6E] text-xss text-center mb-5'}>{submitError}</p>}

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
