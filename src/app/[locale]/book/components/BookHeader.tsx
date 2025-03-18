/* eslint-disable sonarjs/no-commented-code */
'use client'

// import { addMinutes } from 'date-fns'
import { ChevronLeft } from 'icons/ChevronLeft'
import { useParams, useRouter } from 'next/navigation'
// import { useTimer } from 'react-timer-hook'

export const BookHeader = () => {
  const params = useParams()
  const router = useRouter()

  const handleBack = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (params?.serviceId || params?.idReservation) {
      e.preventDefault()
      router.back()
    }
  }

  // const { seconds, minutes } = useTimer({ expiryTimestamp: addMinutes(new Date(), 5) })

  const backText = params?.serviceId
    ? 'zpět na výběr služby'
    : params?.personalId
      ? 'zpět na výběr obsluhy'
      : params?.idReservation
        ? 'zpět na výběr datumu'
        : 'zpět na úvodní stránku'

  const headerText = params?.serviceId
    ? 'Vyberte si obsluhu'
    : params?.personalId
      ? 'Vyberte si datum a čas'
      : params?.idReservation
        ? 'Objednávka'
        : 'Vyberte službu'

  return (
    <>
      <div className={'flex justify-between items-center mb-5'}>
        <a
          href={'/'}
          onClick={handleBack}
          className={'flex items-center gap-3 text-[#A0A0A0] text-resXs '}
        >
          <ChevronLeft />
          <span>{backText}</span>
        </a>
        {/* {params?.idReservation && (
          <div>
            <span
              className={
                'text-[#E71E6E] bg-[#E71E6E40] rounded-special-small py-1 px-1.5 text-book'
              }
            >
              {`${minutes}:${seconds}`}
            </span>
          </div>
        )} */}
      </div>
      <div className={'mb-5.5 text-center'}>
        <h1 className={'text-[#FFFFFFBF] text-resLg'}>{headerText}</h1>
      </div>
    </>
  )
}
