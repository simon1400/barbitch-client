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
import { ComboServiceItem } from './components/ComboServiceItem'
import { getBookService } from './fetch/bookService'
import { getComboServices } from './fetch/comboService'

const BookServicePage = () => {
  const [data, setData] = useState<IBookServiceGroup[]>([])
  const [comboData, setComboData] = useState<any>(null)
  const [accordionValue, setAccordionValue] = useState<string>('')
  const [selectedServiceId, setSelectedServiceId] = useState<string>('')

  useEffect(() => {
    const fetchData = async () => {
      const servicesData = await getBookService()
      const comboServicesData = getComboServices()
      setData(servicesData)
      setComboData(comboServicesData)

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

  if (!comboData) {
    return null
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

      <AccordionItem
        key={comboData.title}
        className={'rounded-special-small bg-[#252523] mb-2.5'}
        value={comboData.title}
      >
        <AccordionTrigger className={'p-5 text-resMd1'}>
          <span className={'flex items-center gap-3'}>
            {comboData.title}
            <span
              className={
                'bg-primary py-0.5 px-2 rounded-full text-xss text-white block text-center'
              }
            >
              {'sleva'}
            </span>
          </span>
        </AccordionTrigger>
        <AccordionContent className={'px-3 pb-0'}>
          <ul>
            {comboData.services.map((service: any) => (
              <ComboServiceItem
                key={service.id}
                service={service}
                category={comboData.title}
                isSelected={selectedServiceId === service.id.toString()}
              />
            ))}
          </ul>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}

export default BookServicePage
