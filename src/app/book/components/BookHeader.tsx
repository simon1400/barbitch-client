'use client'

import { addMinutes } from 'date-fns'
import { useParams, usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useTimer } from 'react-timer-hook'

import { useBookReservation } from './BookReservationContext'

type Step = 'service' | 'personal' | 'reservation' | 'home' | 'extras'

const backTextMap: Record<Step, string> = {
  service: 'zpět na výběr služby',
  personal: 'zpět na výběr obsluhy',
  reservation: 'zpět na výběr datumu',
  home: 'zpět na úvodní stránku',
  extras: 'zpět na výběr služby',
}

const headerTextMap: Record<Step, string> = {
  service: 'Vyberte si obsluhu',
  personal: 'Vyberte si datum a čas',
  reservation: 'Objednávka',
  home: 'Vyberte službu',
  extras: 'Vyberte variantu',
}

export const BookHeader = () => {
  const params = useParams()
  const pathname = usePathname()
  const router = useRouter()
  const { expiredId, setExpiredId } = useBookReservation()
  const idReservation = typeof params?.idReservation === 'string' ? params.idReservation : null

  // Таймер удержания слота имеет смысл только пока текущая резервация не истекла.
  const showTimer = Boolean(idReservation) && expiredId !== idReservation

  const handleBack = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (params?.serviceId || params?.idReservation) {
      e.preventDefault()
      router.back()
    }
  }

  const { seconds, minutes, restart } = useTimer({
    expiryTimestamp: addMinutes(new Date(), 5),
    autoStart: false,
    // Истёк таймер удержания слота → помечаем ИМЕННО эту резервацию истёкшей,
    // чтобы форма заблокировала отправку (иначе Noona отклонит истёкший слот).
    onExpire: () => setExpiredId(idReservation),
  })

  useEffect(() => {
    // BookHeader живёт в layout и переживает навигацию внутри /book, поэтому при
    // каждой НОВОЙ резервации перезапускаем 5-минутный таймер. Сравнение expiredId
    // с текущим id само считает новую резервацию действительной — сброс не нужен.
    if (idReservation) {
      restart(addMinutes(new Date(), 5), true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idReservation])

  const step: Step = pathname?.endsWith('/extras')
    ? 'extras'
    : params?.personalId
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
        {showTimer && (
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
