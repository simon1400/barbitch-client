'use client'

import type { IEngineManageInfo } from '../../book/fetch/engine'

import { RescheduleCalendar } from 'components/booking/RescheduleCalendar'
import { useCallback } from 'react'

import { getEngineManageAvailability, postEngineReschedule } from '../../book/fetch/engine'

interface Props {
  token: string
  onBack: () => void
  onDone: (next: IEngineManageInfo) => void
}

// Токен-флоу переноса (ссылка из письма): тонкая обёртка над общим
// RescheduleCalendar — календарь/подтверждение/ошибки живут там (реюз кабинетом).
export const RescheduleSection = ({ token, onBack, onDone }: Props) => {
  const fetchAvailability = useCallback(
    (from: string, to: string) => getEngineManageAvailability(token, from, to),
    [token],
  )
  const submitReschedule = useCallback(
    (body: { date: string; time: string }) => postEngineReschedule(token, body),
    [token],
  )

  return (
    <RescheduleCalendar
      fetchAvailability={fetchAvailability}
      submitReschedule={submitReschedule}
      onBack={onBack}
      onDone={onDone}
    />
  )
}
