'use client'

import type { IPricelistGroup } from 'fetch/bookingPricelist'

import { Container } from 'components/Container'
import { useState } from 'react'

import { AccordionContent } from './AccordionContent'
import { MainServiceRow } from './MainServiceRow'

const BORDER = 'border-b-[1.5px] border-[#1616154D]'

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
      <div className={'mb-10 space-y-10 md:space-y-14'}>
        {groups.map((group) => (
          <div key={group.title}>
            <div className={'text-sm1 md:text-md1 pb-3 mb-0 md:mb-4 font-bold'}>{group.title}</div>

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
                    <MainServiceRow
                      hasExtras={hasExtras}
                      toggle={toggle}
                      service={service}
                      isOpen={isOpen}
                    />

                    {/* ── accordion content ── */}
                    {hasExtras && isOpen && (
                      <AccordionContent
                        addons={addons}
                        hasModifiers={hasModifiers}
                        modifiers={modifiers}
                        service={service}
                      />
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
