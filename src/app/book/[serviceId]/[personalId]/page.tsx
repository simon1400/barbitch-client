import type { Metadata } from 'next'

import { Suspense } from 'react'

import { getMasterPriorities } from '../../fetch/masterPriority'
import { getSlotService } from '../../fetch/slotsService'

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
}: {
  serviceId: string
  personalId: string
}) {
  const [data, masterPriorities] = await Promise.all([
    getSlotService(serviceId, personalId),
    personalId === 'any' ? getMasterPriorities() : Promise.resolve([]),
  ])

  const executeDateStrings = data.executeDate.map((d) => d.toISOString())

  return (
    <BookCalendarClient
      initialData={{
        executeDateStrings,
        filteredData: data.filteredData,
        masterPriorities,
        employeeEventTypeMap: data.employeeEventTypeMap,
        employeeLoad: data.employeeLoad,
      }}
    />
  )
}

export default async function BookCalendarPage({
  params,
}: {
  params: Promise<{ serviceId: string; personalId: string }>
}) {
  const { serviceId, personalId } = await params

  return (
    <Suspense fallback={<CalendarSkeleton />}>
      <BookCalendarContent serviceId={serviceId} personalId={personalId} />
    </Suspense>
  )
}
