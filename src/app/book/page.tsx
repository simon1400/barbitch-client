import type { IBookServiceGroup } from './fetch/bookService'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

import { BookServiceItem } from './components/BookServiceItem'
import { getBookService } from './fetch/bookService'

const BookServicePage = async () => {
  const data: IBookServiceGroup[] = await getBookService()

  return (
    <Accordion type={'single'} collapsible defaultValue={''}>
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
    </Accordion>
  )
}

export default BookServicePage
