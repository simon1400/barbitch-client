import type { IPricelistService } from 'fetch/bookingPricelist'

import { ChevronDown } from 'lucide-react'

import { BookLink } from './BookLink'

export const MainServiceRow = ({
  hasExtras,
  toggle,
  service,
  isOpen,
}: {
  hasExtras: boolean
  toggle: (id: string) => void
  service: IPricelistService
  isOpen: boolean
}) => {
  return (
    <div
      role={hasExtras ? 'button' : undefined}
      onClick={hasExtras ? () => toggle(service.id) : undefined}
      className={`flex items-center gap-3 py-2 md:py-3 ${hasExtras ? 'cursor-pointer select-none' : ''}`}
    >
      <span className={'font-bold text-xs md:text-sm flex-1 min-w-0'}>{service.title}</span>
      {/* <span className={'shrink-0 text-xs1 text-[#888] whitespace-nowrap'}>
        {`${service.minutes} min`}
      </span> */}
      <span className={'shrink-0 font-bold text-xs whitespace-nowrap'}>
        {`${service.basePrice} Kč`}
      </span>
      <BookLink href={`/book/${service.id}/extras`} />
      {hasExtras ? (
        <ChevronDown
          size={25}
          className={`shrink-0 text-[#A0A0A0] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      ) : (
        <span className={'w-6.5 shrink-0'} />
      )}
    </div>
  )
}
