'use client'

import { createContext, useContext, useMemo, useState } from 'react'

interface BookReservationCtx {
  /** id резервации, чьё удержание слота истекло/невалидно. */
  expiredId: string | null
  setExpiredId: (id: string | null) => void
}

const BookReservationContext = createContext<BookReservationCtx>({
  expiredId: null,
  setExpiredId: () => {},
})

export const useBookReservation = () => useContext(BookReservationContext)

export const BookReservationProvider = ({ children }: { children: React.ReactNode }) => {
  const [expiredId, setExpiredId] = useState<string | null>(null)
  const value = useMemo(() => ({ expiredId, setExpiredId }), [expiredId])

  return <BookReservationContext value={value}>{children}</BookReservationContext>
}
