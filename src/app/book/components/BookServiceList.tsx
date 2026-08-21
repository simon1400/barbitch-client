'use client'

import type { IEngineServiceGroup } from '../fetch/engine'

import Button from 'components/Button'
import { useCallback, useEffect, useState } from 'react'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { getEngineCatalog } from '../fetch/engine'

import { BookServiceItem } from './BookServiceItem'

/**
 * Interaktivní část katalogu. Data přicházejí ze serveru (`initialGroups`) —
 * dřív se celý katalog tahal až v `useEffect`, takže v HTML byl jen skeleton,
 * ačkoli je `/book` indexovaná stránka v sitemap.
 *
 * Znovunačtení se spouští jen tehdy, když serverový pokus selhal.
 */
export const BookServiceList = ({
  initialGroups,
  initialFailed,
}: {
  initialGroups: IEngineServiceGroup[]
  initialFailed: boolean
}) => {
  const [data, setData] = useState<IEngineServiceGroup[]>(initialGroups)
  const [accordionValue, setAccordionValue] = useState<string>('')
  const [selectedServiceId, setSelectedServiceId] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const [hasError, setHasError] = useState(initialFailed)

  const fetchData = useCallback(async () => {
    setIsLoading(true)
    setHasError(false)
    try {
      const groups = await getEngineCatalog()
      setData(groups.filter((g) => g.services.length > 0))
    } catch {
      // Obvykle výpadek mobilního připojení — necháme uživatele to zkusit znovu.
      setHasError(true)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Návrat z dalšího kroku rezervace: rozbalíme kategorii a zvýrazníme službu.
  useEffect(() => {
    const savedState = sessionStorage.getItem('lastBookingState')
    if (!savedState) return
    try {
      const parsed = JSON.parse(savedState)
      setAccordionValue(parsed.category)
      setSelectedServiceId(parsed.serviceId)
    } catch {
      // Poškozený záznam nemá bránit zobrazení katalogu.
    }
    sessionStorage.removeItem('lastBookingState')
  }, [])

  if (isLoading) {
    return (
      <div className={'animate-pulse space-y-2.5'}>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className={'bg-[#252523] rounded-special-small h-[60px]'} />
        ))}
      </div>
    )
  }

  if (hasError && data.length === 0) {
    return (
      <div className={'bg-[#252523] rounded-special-small p-6 text-center'}>
        <p className={'text-white text-resMd1 mb-1'}>{'Nepodařilo se načíst služby'}</p>
        <p className={'text-[#A0A0A0] text-xss mb-5'}>
          {'Zkontrolujte připojení k internetu a zkuste to znovu.'}
        </p>
        <Button
          text={'Zkusit znovu'}
          href={'#'}
          inverse
          small
          onClick={(e) => {
            e.preventDefault()
            fetchData()
          }}
        />
      </div>
    )
  }

  return (
    <Accordion type={'single'} collapsible value={accordionValue} onValueChange={setAccordionValue}>
      {data.map((group) => (
        <AccordionItem
          key={group.title}
          className={'rounded-special-small bg-[#252523] mb-2.5'}
          value={group.title}
        >
          <AccordionTrigger className={'p-5 text-resMd1'}>{group.title}</AccordionTrigger>
          {/* `forceMount`: bez něj Radix zavřenou sekci vůbec nevykreslí a názvy
              ani ceny služeb by se do HTML nedostaly. Zavřená sekce zůstává
              skrytá přes `hidden`, chování pro uživatele se nemění. */}
          <AccordionContent forceMount className={'px-3 pb-0'}>
            <ul>
              {group.services.map((service) => (
                <BookServiceItem
                  key={service.id}
                  service={service}
                  category={group.title}
                  isSelected={selectedServiceId === service.id}
                />
              ))}
            </ul>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}
