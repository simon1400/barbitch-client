import type { IEngineModifier, IEngineVariant } from 'app/book/fetch/engine'
import type { IPricelistService } from 'fetch/bookingPricelist'

import { selectionToQuery } from 'app/book/fetch/engine'

import { BookLink } from './BookLink'
import { PriceBadge } from './PriceBadge'

export const AccordionContent = ({
  variants,
  hasModifiers,
  modifiers,
  service,
}: {
  variants: IEngineVariant[]
  hasModifiers: boolean
  modifiers: IEngineModifier[]
  service: IPricelistService
}) => {
  return (
    <div className={'pb-3'}>
      {variants.map((variant) => (
        <div key={variant.label} className={'flex items-center gap-3 py-1 pl-3 md:pl-5'}>
          <span className={'text-xs1 text-[#444] flex-1 min-w-0'}>{variant.label}</span>
          <PriceBadge diff={variant.priceDiff} />
          <span className={'shrink-0 text-xs1 font-semibold whitespace-nowrap'}>
            {`${service.basePrice + variant.priceDiff} Kč`}
          </span>
          {/* предвыбранный вариант уходит на выбор мастера через query (?v=, формат s101) */}
          <BookLink
            href={`/book/${service.id}${selectionToQuery({ variant: variant.label, modifiers: [] })}`}
          />
          <span className={'w-6.5 shrink-0'} />
        </div>
      ))}

      {hasModifiers && (
        <div className={'pl-3 md:pl-5 pt-2'}>
          <div
            className={' pb-1.5 pt-5 text-xss tracking-wider uppercase text-[#555] font-semibold'}
          >
            {'Doplňky'}
          </div>
          {modifiers.map((mod) => (
            <div key={mod.key} className={'flex items-center gap-3 py-2'}>
              <span className={'text-xs1 text-[#444] flex-1 min-w-0'}>{mod.label}</span>
              <PriceBadge diff={mod.priceDiff} />
              <span className={'w-6.5 shrink-0'} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
