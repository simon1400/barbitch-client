'use client'

import type { IPricelistGroup } from 'fetch/bookingPricelist'

import { Container } from 'components/Container'
import { useState } from 'react'

import { AccordionContent } from './AccordionContent'
import { MainServiceRow } from './MainServiceRow'

const BORDER = 'border-b-[1.5px] border-[#1616154D]'

// Kotva ve tvaru `#cenik-manikura` — použitelná v odkazech i pro sitelinky.
const slugify = (value: string): string =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replaceAll(/[\u0300-\u036F]/g, '')
    .replaceAll(/[^a-z0-9]+/g, '-')
    // Bez regexu s alternací/kvantifikátorem na koncích — jen ořez pomlček.
    .split('-')
    .filter(Boolean)
    .join('-')

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
            {/* Nadpis skupiny byl <div> — outline stránky tak neměl žádnou
                strukturu a skupiny neměly kotvu, na kterou by šlo odkázat. */}
            <h2
              id={`cenik-${slugify(group.title)}`}
              className={'text-sm1 md:text-md1 pb-3 mb-0 md:mb-4 font-bold scroll-mt-24'}
            >
              {group.title}
            </h2>

            <div>
              {group.services.map((service) => {
                const variants = service.variants ?? []
                const modifiers = service.modifiers ?? []
                const hasVariants = variants.length > 0
                const hasModifiers = modifiers.length > 0
                const hasExtras = hasVariants || hasModifiers
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
                        variants={variants}
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
