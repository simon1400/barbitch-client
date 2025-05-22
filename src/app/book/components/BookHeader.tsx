'use client'

import { addMinutes } from 'date-fns'
import { useParams, useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useTimer } from 'react-timer-hook'

type Step = 'service' | 'personal' | 'reservation' | 'home'

const backTextMap: Record<Step, string> = {
  service: 'zpět na výběr služby',
  personal: 'zpět na výběr obsluhy',
  reservation: 'zpět na výběr datumu',
  home: 'zpět na úvodní stránku',
}

const headerTextMap: Record<Step, string> = {
  service: 'Vyberte si obsluhu',
  personal: 'Vyberte si datum a čas',
  reservation: 'Objednávka',
  home: 'Vyberte službu',
}

export const BookHeader = () => {
  const params = useParams()
  const router = useRouter()

  const handleBack = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (params?.serviceId || params?.idReservation) {
      e.preventDefault()
      router.back()
    }
  }

  const { seconds, minutes, start } = useTimer({
    expiryTimestamp: addMinutes(new Date(), 5),
    autoStart: false,
  })

  useEffect(() => {
    if (params?.idReservation) {
      start()
    }
  }, [params])

  const step: Step = params?.personalId
    ? 'personal'
    : params?.serviceId
      ? 'service'
      : params?.idReservation
        ? 'reservation'
        : 'home'

  const backText = backTextMap[step]
  const headerText = headerTextMap[step]

  return (
    <>
      <div className={'flex justify-between items-center mb-5'}>
        <a
          href={'/'}
          onClick={handleBack}
          className={'flex items-center gap-3 text-[#A0A0A0] text-resXs '}
        >
          <img src={'/assets/icons/chevronLeft.svg'} alt={'Chevron left icon'} />
          <span>{backText}</span>
        </a>
        {params?.idReservation && (
          <div>
            <span
              className={
                'text-[#E71E6E] bg-[#E71E6E40] rounded-special-small py-1 px-1.5 text-book'
              }
            >
              {`${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`}
            </span>
          </div>
        )}
      </div>
      <div className={'mb-5.5 text-center'}>
        <h1 className={'text-[#FFFFFFBF] text-resLg'}>{headerText}</h1>
      </div>
    </>
  )
}
