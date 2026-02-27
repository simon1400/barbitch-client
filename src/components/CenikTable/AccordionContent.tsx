import type { IAddonItem, IModifierItem } from 'app/book/fetch/addonGroupService'
import type { IPricelistService } from 'fetch/bookingPricelist'

import { BookLink } from './BookLink'
import { PriceBadge } from './PriceBadge'

export const AccordionContent = ({
  addons,
  hasModifiers,
  modifiers,
  service,
}: {
  addons: IAddonItem[]
  hasModifiers: boolean
  modifiers: IModifierItem[]
  service: IPricelistService
}) => {
  return (
    <div className={'pb-3'}>
      {addons.map((addon) => (
        <div key={addon.result_noona_id} className={'flex items-center gap-3 py-1 pl-3 md:pl-5'}>
          <span className={'text-xs1 text-[#444] flex-1 min-w-0'}>{addon.label}</span>
          <PriceBadge diff={addon.price_diff} />
          <span className={'shrink-0 text-xs1 font-semibold whitespace-nowrap'}>
            {`${service.basePrice + addon.price_diff} Kč`}
          </span>
          <BookLink href={`/book/${addon.result_noona_id}`} />
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
              <PriceBadge diff={mod.price_diff} />
              <span className={'w-6.5 shrink-0'} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
