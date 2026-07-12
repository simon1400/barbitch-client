/* eslint-disable import/order */
import type { Metadata } from 'next'
import type { ISelection } from '../../fetch/engine'

import { addDays, addMonths, endOfMonth, format } from 'date-fns'
import Link from 'next/link'
import { Suspense } from 'react'

import { getEngineAvailability, selectionFromSearchParams } from '../../fetch/engine'

import BookCalendarClient from './BookCalendarClient'
import CalendarSkeleton from './components/CalendarSkeleton'

export const metadata: Metadata = {
  title: 'Výběr termínu | Rezervace – Barbitch Beauty Studio Brno',
  description: 'Vyberte si datum a čas pro vaši rezervaci v Barbitch Beauty Studiu v Brně.',
  robots: { index: false, follow: false },
}

async function BookCalendarContent({
  serviceId,
  personalId,
  selection,
}: {
  serviceId: string
  personalId: string
  selection: ISelection
}) {
  // Окно как в старом Noona-флоу: от сегодня до конца месяца +3 (движок пускает ≤120 дней)
  const from = format(new Date(), 'yyyy-MM-dd')
  const to = format(endOfMonth(addMonths(new Date(), 3)), 'yyyy-MM-dd')

  let days: Awaited<ReturnType<typeof getEngineAvailability>>['days'] = []
  let failed = false
  try {
    const availability = await getEngineAvailability({
      service: serviceId,
      selection,
      employee: personalId,
      from,
      to,
    })
    days = availability.days
  } catch {
    failed = true
  }

  if (failed) {
    return (
      <div className={'bg-[#252523] rounded-special-small px-5 py-10 text-center'}>
        <h2 className={'text-xs1 leading-snug mb-5'}>
          {'Rezervační systém je momentálně nedostupný. Zkuste to prosím za chvíli.'}
        </h2>
        <Link
          className={
            'inline-block bg-primary text-white text-xs1 font-bold rounded-special-small px-6 py-3'
          }
          href={'/book'}
        >
          {'Zpět na výběr služby'}
        </Link>
      </div>
    )
  }

  // Движок отдаёт только дни СО слотами → для DatePicker собираем «серые» даты
  // (все даты окна без свободных слотов).
  const datesWithSlots = new Set(days.map((d) => d.date))
  const executeDateStrings: string[] = []
  for (let d = new Date(); format(d, 'yyyy-MM-dd') <= to; d = addDays(d, 1)) {
    const key = format(d, 'yyyy-MM-dd')
    if (!datesWithSlots.has(key)) executeDateStrings.push(key)
  }

  const filteredData = days.map((day) => ({
    date: day.date,
    slots: day.slots.map((s) => ({ time: s.time })),
  }))

  return (
    <BookCalendarClient
      initialData={{
        executeDateStrings,
        filteredData,
        selection,
      }}
    />
  )
}

export default async function BookCalendarPage({
  params,
  searchParams,
}: {
  params: Promise<{ serviceId: string; personalId: string }>
  searchParams: Promise<{ v?: string; m?: string }>
}) {
  const { serviceId, personalId } = await params
  const selection = selectionFromSearchParams((await searchParams) ?? {})

  return (
    <Suspense fallback={<CalendarSkeleton />}>
      <BookCalendarContent serviceId={serviceId} personalId={personalId} selection={selection} />
    </Suspense>
  )
}
