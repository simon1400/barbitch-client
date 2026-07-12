'use client'

import type { IEngineServiceGroup } from './fetch/engine'

import Button from 'components/Button'
import { useCallback, useEffect, useState } from 'react'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

import { BookServiceItem } from './components/BookServiceItem'
import { getEngineCatalog } from './fetch/engine'

// Каталог приходит из собственного движка (/api/engine/services): только
// active+onlineBookable услуги, уже сгруппированные по категориям — ни фильтра
// категорий, ни скрытия combo-услуг (как при Noona) больше не нужно.

const BookServiceSkeleton = () => (
  <div className={'animate-pulse space-y-2.5'}>
    {[1, 2, 3, 4].map((i) => (
      <div key={i} className={'bg-[#252523] rounded-special-small h-[60px]'} />
    ))}
  </div>
)

const BookServicePage = () => {
  const [data, setData] = useState<IEngineServiceGroup[]>([])
  const [accordionValue, setAccordionValue] = useState<string>('')
  const [selectedServiceId, setSelectedServiceId] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  const fetchData = useCallback(async () => {
    setIsLoading(true)
    setHasError(false)
    try {
      const groups = await getEngineCatalog()
      setData(groups.filter((g) => g.services.length > 0))

      const savedState = sessionStorage.getItem('lastBookingState')
      if (savedState) {
        const parsed = JSON.parse(savedState)
        setAccordionValue(parsed.category)
        setSelectedServiceId(parsed.serviceId)
        sessionStorage.removeItem('lastBookingState')
      }
    } catch {
      // Obvykle výpadek mobilního připojení — necháme uživatele to zkusit znovu.
      setHasError(true)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  if (isLoading) return <BookServiceSkeleton />

  if (hasError) {
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
          <AccordionContent className={'px-3 pb-0'}>
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

export default BookServicePage
