import type { IBookServiceGroup } from './fetch/bookService'

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

const BookServicePage = async () => {
  const data: IBookServiceGroup[] = await getBookService()
  const comboData = getComboServices()

  return (
    <Accordion type={'single'} collapsible defaultValue={''}>
      {/* Обычные услуги */}
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
                <BookServiceItem key={service.id} service={service} />
              ))}
            </ul>
          </AccordionContent>
        </AccordionItem>
      ))}

      {/* Комбинированные услуги */}
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
            {comboData.services.map((service) => (
              <ComboServiceItem key={service.id} service={service} />
            ))}
          </ul>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}

export default BookServicePage
