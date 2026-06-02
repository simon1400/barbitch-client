'use client'

import Button from 'components/Button'
import { useEffect } from 'react'

import { useBookReservation } from '../../../components/BookReservationContext'

export const ReservationExpired = ({ idReservation }: { idReservation: string }) => {
  const { setExpiredId } = useBookReservation()

  useEffect(() => {
    setExpiredId(idReservation)
  }, [idReservation, setExpiredId])

  return (
    <div className={'bg-[#252523] rounded-special-small p-6 text-center'}>
      <p className={'text-white text-resMd1 mb-1'}>{'Rezervace vypršela'}</p>
      <p className={'text-[#A0A0A0] text-xss mb-5'}>
        {'Platnost této rezervace vypršela nebo nebyla nalezena. Vyberte prosím nový termín.'}
      </p>
      <Button text={'Zpět na rezervaci'} href={'/book'} inverse small />
    </div>
  )
}
