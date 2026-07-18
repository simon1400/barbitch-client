'use client'

import type { ICabinetBooking, ICabinetBookings } from '../fetch/cabinetApi'

import { selectionToQuery } from '../../book/fetch/engine'

import { SectionTitle } from './shared'

// «Rychlá rezervace»: deep-link /book/{serviceDocId}?v=&m= по последнему снапшоту
// с serviceDocId (движковые брони) — клиент попадает сразу на выбор мастера
// с предвыбранным вариантом/допами.
export const RebookSection = ({ bookings }: { bookings: ICabinetBookings }) => {
  const source: ICabinetBooking[] = [...bookings.history, ...bookings.upcoming]
  const last = source.find((b) => b.services?.[0]?.serviceDocId)
  if (!last) return null

  const item = last.services[0]
  const href = `/book/${item.serviceDocId}${selectionToQuery({
    variant: item.variant ?? null,
    modifiers: item.modifiers ?? [],
  })}`

  return (
    <section>
      <SectionTitle>{'Rychlá rezervace'}</SectionTitle>
      <div className={'bg-[#252523] rounded-special-small px-5 py-4'}>
        <p className={'text-[#A0A0A0] text-xss mb-3'}>
          {'Vaše poslední služba: '}
          <span className={'text-white'}>{item.title}</span>
        </p>
        <a
          className={
            'inline-block bg-primary hover:bg-[#c9195f] transition-colors duration-150 text-white text-xs1 font-bold rounded-special-small px-6 py-3'
          }
          href={href}
        >
          {'Rezervovat znovu'}
        </a>
      </div>
    </section>
  )
}
