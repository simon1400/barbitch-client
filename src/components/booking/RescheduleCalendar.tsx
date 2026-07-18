'use client'

import type {
  IEngineAvailability,
  IEngineDay,
  IEngineManageInfo,
} from '../../app/book/fetch/engine'

import { addDays, addMonths, endOfMonth, format, parseISO } from 'date-fns'
import { cs } from 'date-fns/locale/cs'
import dynamic from 'next/dynamic'
import { useCallback, useEffect, useMemo, useState } from 'react'

import { CalendarSkeletonInner } from '../../app/book/[serviceId]/[personalId]/components/CalendarSkeleton'
import { engineErrorCode } from '../../app/book/fetch/engine'

const BookDatePicker = dynamic(
  () => import('../../app/book/[serviceId]/[personalId]/components/DatePicker'),
  { ssr: false, loading: () => <CalendarSkeletonInner /> },
)
const TimePicker = dynamic(
  () => import('../../app/book/[serviceId]/[personalId]/components/TimePicker'),
  { ssr: false },
)
const EmptyAlert = dynamic(
  () => import('../../app/book/[serviceId]/[personalId]/components/EmptyAlert'),
  { ssr: false },
)

const RESCHEDULE_ERRORS: Record<string, string> = {
  too_late: 'Termín už nelze změnit online — zavolejte prosím do salonu.',
  not_active: 'Rezervace už není aktivní.',
  reschedule_limit: 'Online přesun už není dostupný — zavolejte prosím do salonu.',
  reschedule_unavailable: 'Tuto rezervaci nelze přesunout online — zavolejte prosím do salonu.',
}

interface Props {
  /** Слоты для переноса (окно from..to) — токен-флоу или JWT-флоу кабинета. */
  fetchAvailability: (from: string, to: string) => Promise<IEngineAvailability>
  /** Сабмит переноса — источник (токен/JWT) знает обёртка, календарь — нет. */
  submitReschedule: (body: { date: string; time: string }) => Promise<IEngineManageInfo>
  onBack: () => void
  onDone: (next: IEngineManageInfo) => void
}

// Общий календарь переноса термина: используется страницей /rezervace/{token}
// (токен из письма) и кабинетом /cabinet (JWT). UI и поведение идентичны —
// различается только источник availability/сабмита (пропсы).
export const RescheduleCalendar = ({
  fetchAvailability,
  submitReschedule,
  onBack,
  onDone,
}: Props) => {
  const [days, setDays] = useState<IEngineDay[] | null>(null)
  const [loadError, setLoadError] = useState('')
  const [selected, setSelected] = useState<Date | null>(new Date())
  const [pendingTime, setPendingTime] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const windowTo = useMemo(() => format(endOfMonth(addMonths(new Date(), 3)), 'yyyy-MM-dd'), [])

  const loadAvailability = useCallback(async () => {
    setDays(null)
    setLoadError('')
    try {
      const availability = await fetchAvailability(format(new Date(), 'yyyy-MM-dd'), windowTo)
      setDays(availability.days)
    } catch (err) {
      const code = engineErrorCode(err)
      setLoadError(
        RESCHEDULE_ERRORS[code] ?? 'Volné termíny se nepodařilo načíst. Zkuste to prosím znovu.',
      )
    }
  }, [fetchAvailability, windowTo])

  useEffect(() => {
    loadAvailability()
  }, [loadAvailability])

  // DatePicker принимает «серые» даты → все даты окна БЕЗ свободных слотов
  const excludeDates = useMemo(() => {
    if (!days) return []
    const withSlots = new Set(days.map((d) => d.date))
    const out: Date[] = []
    for (let d = new Date(); format(d, 'yyyy-MM-dd') <= windowTo; d = addDays(d, 1)) {
      const key = format(d, 'yyyy-MM-dd')
      if (!withSlots.has(key)) out.push(parseISO(key))
    }
    return out
  }, [days, windowTo])

  const slots = useMemo(() => {
    if (!days || !selected) return []
    const key = format(selected, 'yyyy-MM-dd')
    return (days.find((d) => d.date === key)?.slots ?? []).map((s) => ({ time: s.time }))
  }, [days, selected])

  const selectDate = (value: Date | null) => {
    if (!value) return
    setPendingTime('')
    setSubmitError('')
    setSelected(value)
  }

  const handleConfirm = async () => {
    if (submitting || !pendingTime || !selected) return
    setSubmitting(true)
    setSubmitError('')
    try {
      const result = await submitReschedule({
        date: format(selected, 'yyyy-MM-dd'),
        time: pendingTime,
      })
      onDone(result)
    } catch (err) {
      const code = engineErrorCode(err)
      if (code === 'slot_taken') {
        setSubmitError('Tento termín byl právě obsazen. Vyberte prosím jiný čas.')
        setPendingTime('')
        loadAvailability()
      } else {
        setSubmitError(RESCHEDULE_ERRORS[code] ?? 'Přesun se nepodařil. Zkuste to prosím znovu.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  const renderConfirm = () => (
    <div className={'border border-[#3C3C3C] rounded-special-small px-4 py-4 mt-5 text-center'}>
      <p className={'text-white text-xss mb-4'}>
        {'Přesunout rezervaci na '}
        <strong>
          {format(selected as Date, 'EEEE d. M. yyyy', { locale: cs })}
          {` v ${pendingTime}`}
        </strong>
        {'?'}
      </p>
      <div className={'flex flex-col items-center gap-3'}>
        <button
          type={'button'}
          onClick={handleConfirm}
          disabled={submitting}
          className={`w-full max-w-[270px] transition-colors duration-150 text-white font-semibold text-xs1 py-3.5 rounded-special-small ${
            submitting ? 'bg-[#5a5a5a] cursor-progress' : 'bg-primary hover:bg-[#c9195f]'
          }`}
        >
          {submitting ? 'Přesouvám…' : 'Potvrdit přesun'}
        </button>
        <button
          type={'button'}
          onClick={() => setPendingTime('')}
          disabled={submitting}
          className={
            'w-full max-w-[270px] border border-[#3C3C3C] text-[#A0A0A0] text-xs1 py-3 rounded-special-small hover:text-white'
          }
        >
          {'Jiný čas'}
        </button>
      </div>
    </div>
  )

  const renderBody = () => {
    if (loadError) return <p className={'text-[#E71E6E] text-xss text-center py-6'}>{loadError}</p>
    if (!days) return <CalendarSkeletonInner />
    return (
      <>
        <BookDatePicker data={excludeDates} selected={selected as Date} selectDate={selectDate} />
        {submitError && <p className={'text-[#E71E6E] text-xss text-center pt-3'}>{submitError}</p>}
        {pendingTime && renderConfirm()}
        {!pendingTime &&
          (slots.length ? (
            <TimePicker slots={slots} handleSelect={setPendingTime} loadingTimepicker={''} />
          ) : (
            <EmptyAlert />
          ))}
      </>
    )
  }

  return (
    <div className={'bg-[#252523] rounded-special-small px-7.5 py-5'}>
      <div className={'flex items-center justify-between mb-4'}>
        <button
          type={'button'}
          onClick={onBack}
          className={'text-[#A0A0A0] text-xss hover:text-white'}
        >
          {'← Zpět'}
        </button>
        <p className={'text-white text-xs1 font-semibold'}>{'Nový termín'}</p>
        <span className={'w-10'} />
      </div>
      {renderBody()}
    </div>
  )
}
