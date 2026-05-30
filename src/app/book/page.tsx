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

// На /book показываем только эти категории. Сопоставление по вхождению
// подстроки — устойчиво к эмодзи/пробелам в конце названия группы Noona.
// Junior-группа («Nehty - Junior», 656 услуг) и пулы вариантов
// (Gel lak manikúra, Prodloužení nehtů, Sundání, Nano-zpevnění,
// Hygienická manikúra и т.п.) сюда не попадают и не грузятся в список.
const VISIBLE_CATEGORY_MATCHERS = ['Nehty 💅', 'Obočí', 'barvení a péče', 'Prodlužování řas']

const isVisibleCategory = (title: string): boolean =>
  VISIBLE_CATEGORY_MATCHERS.some((m) => title.includes(m))

const filterGroups = (groups: IBookServiceGroup[], hiddenIds: Set<string>): IBookServiceGroup[] =>
  groups
    .filter((group) => isVisibleCategory(group.title))
    .map((group) => ({
      ...group,
      group_event_types: group.group_event_types.filter((s) => !hiddenIds.has(s.id.toString())),
    }))
    .filter((group) => group.group_event_types.length > 0)

const BookServiceSkeleton = () => (
  <div className={'animate-pulse space-y-2.5'}>
    {[1, 2, 3, 4].map((i) => (
      <div key={i} className={'bg-[#252523] rounded-special-small h-[60px]'} />
    ))}
  </div>
)

const BookServicePage = () => {
  const [data, setData] = useState<IBookServiceGroup[]>([])
  const [accordionValue, setAccordionValue] = useState<string>('')
  const [selectedServiceId, setSelectedServiceId] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)

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

      setIsLoading(false)
    }

    fetchData()
  }, [])

  if (isLoading) return <BookServiceSkeleton />

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
