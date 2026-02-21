'use client'

import type { IBookServiceGroup } from './fetch/bookService'

import { useEffect, useState } from 'react'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

import { BookServiceItem } from './components/BookServiceItem'
import { getHiddenServiceIds } from './fetch/addonGroupService'
import { getBookService } from './fetch/bookService'

const filterGroups = (groups: IBookServiceGroup[], hiddenIds: Set<string>): IBookServiceGroup[] =>
  groups
    .map((group) => ({
      ...group,
      group_event_types: group.group_event_types.filter((s) => !hiddenIds.has(s.id.toString())),
    }))
    .filter((group) => group.group_event_types.length > 0)

const BookServicePage = () => {
  const [data, setData] = useState<IBookServiceGroup[]>([])
  const [accordionValue, setAccordionValue] = useState<string>('')
  const [selectedServiceId, setSelectedServiceId] = useState<string>('')

  useEffect(() => {
    const fetchData = async () => {
      const [servicesData, hiddenIds] = await Promise.all([getBookService(), getHiddenServiceIds()])

      const filtered = filterGroups(servicesData, hiddenIds)

      setData(filtered)

      const savedState = sessionStorage.getItem('lastBookingState')
      if (savedState) {
        const parsed = JSON.parse(savedState)
        setAccordionValue(parsed.category)
        setSelectedServiceId(parsed.serviceId)
        sessionStorage.removeItem('lastBookingState')
      }
    }

    fetchData()
  }, [])

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
              {group.group_event_types.map((service) => (
                <BookServiceItem
                  key={service.id}
                  service={service}
                  category={group.title}
                  isSelected={selectedServiceId === service.id.toString()}
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
