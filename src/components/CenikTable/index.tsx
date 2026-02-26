'use client'

import type { IPricelistGroup } from 'fetch/bookingPricelist'

import { Container } from 'components/Container'
import { ChevronDown } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

const BORDER = 'border-b-[1.5px] border-[#1616154D]'

const BookLink = ({ href }: { href: string }) => (
  <span onClick={(e) => e.stopPropagation()}>
    <Link
      href={href}
      className={'font-bold text-[11px] text-primary hover:underline whitespace-nowrap'}
    >
      <span className={'hidden md:inline'}>{'Rezervovat'}</span>
      <span className={'md:hidden inline-block w-5 h-5'}>
        <Image
          src={'/assets/icons/calendar.svg'}
          alt={'Rezervovat'}
          width={20}
          height={20}
          className={'w-full h-full'}
        />
      </span>
    </Link>
  </span>
)

const PriceBadge = ({ diff }: { diff: number }) => (
  <span
    className={
      'shrink-0 inline-block text-[10px] font-semibold text-primary bg-[#E71E6E14] border border-[#E71E6E30] rounded-full px-2 py-0.5 whitespace-nowrap'
    }
  >
    {`+${diff} Kč`}
  </span>
)

export const CenikTable = ({ groups }: { groups: IPricelistGroup[] }) => {
  const [openIds, setOpenIds] = useState<Set<string>>(new Set())

  const toggle = (id: string) =>
    setOpenIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })

  if (!groups?.length) return null

  return (
    <Container size={'lg'}>
      <div className={'mb-10 space-y-14'}>
        {groups.map((group) => (
          <div key={group.title}>
            <div className={'text-sm1 md:text-md1 pb-3 mb-4 font-bold'}>{group.title}</div>

            <div>
              {group.services.map((service) => {
                const ag = service.addonGroup
                const addons = ag?.addons ?? []
                const modifiers = ag?.modifiers ?? []
                const hasAddons = addons.length > 0
                const hasModifiers = modifiers.length > 0
                const hasExtras = hasAddons || hasModifiers
                const isOpen = openIds.has(service.id)

                return (
                  <div key={service.id} className={BORDER}>
                    {/* ── main service row ── */}
                    <div
                      role={hasExtras ? 'button' : undefined}
                      onClick={hasExtras ? () => toggle(service.id) : undefined}
                      className={`flex items-center gap-3 py-3 ${hasExtras ? 'cursor-pointer select-none' : ''}`}
                    >
                      <span className={'font-bold text-sm11 md:text-sm flex-1 min-w-0'}>
                        {service.title}
                      </span>
                      <span className={'shrink-0 text-xs1 text-[#888] whitespace-nowrap'}>
                        {`${service.minutes} min`}
                      </span>
                      <span className={'shrink-0 font-bold text-sm11 whitespace-nowrap'}>
                        {`${service.basePrice} Kč`}
                      </span>
                      <BookLink href={`/book/${service.id}/extras`} />
                      {hasExtras ? (
                        <ChevronDown
                          size={25}
                          className={`shrink-0 text-[#A0A0A0] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                        />
                      ) : (
                        <span className={'w-4 shrink-0'} />
                      )}
                    </div>

                    {/* ── accordion content ── */}
                    {hasExtras && isOpen && (
                      <div className={'pb-3'}>
                        {addons.map((addon) => (
                          <div
                            key={addon.result_noona_id}
                            className={'flex items-center gap-3 py-2 pl-5'}
                          >
                            <span className={'text-xs1 text-[#444] flex-1 min-w-0'}>
                              {addon.label}
                            </span>
                            <PriceBadge diff={addon.price_diff} />
                            <span className={'shrink-0 text-xs1 font-semibold whitespace-nowrap'}>
                              {`${service.basePrice + addon.price_diff} Kč`}
                            </span>
                            <BookLink href={`/book/${addon.result_noona_id}`} />
                            <span className={'w-4 shrink-0'} />
                          </div>
                        ))}

                        {hasModifiers && (
                          <div className={'pt-2'}>
                            <div
                              className={
                                'pl-5 pb-1.5 pt-5 text-xss tracking-wider uppercase text-[#555] font-semibold'
                              }
                            >
                              {'Doplňky'}
                            </div>
                            {modifiers.map((mod) => (
                              <div key={mod.key} className={'flex items-center gap-3 py-2 pl-5'}>
                                <span className={'text-xs1 text-[#444] flex-1 min-w-0'}>
                                  {mod.label}
                                </span>
                                <PriceBadge diff={mod.price_diff} />
                                <span className={'w-4 shrink-0'} />
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </Container>
  )
}
