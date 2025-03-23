import type { IBookService, IBookServiceGroup } from './fetch/bookService'

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { ChevronRight } from 'icons/ChevronRight'
import Image from 'next/image'
import Link from 'next/link'
import { getBookService } from './fetch/bookService'

const BookServiceItem = ({ service }: { service: IBookService }) => {
  const price = service.variations?.[0]?.prices?.[0]?.amount ?? 'N/A'

  return (
    <li className={'border-t-2 border-[#3C3C3C] border-dotted'}>
      <Link
        className={'flex py-3.5 px-1 items-center gap-4 hover:bg-[#3C3C3C] duration-200'}
        href={`/book/${service.id}`}
      >
        <span
          className={'min-w-[36px] w-[36px] h-[36px] overflow-hidden rounded-full block relative'}
        >
          <Image
            className={'object-cover object-center w-full h-full'}
            src={'/assets/iconService.jpg'}
            fill
            alt={'Icon service'}
          />
        </span>
        <span className={'w-full'}>
          <h3 className={'text-xs1 leading-none mb-1.5'}>{service.title}</h3>
          <p className={'text-[#A0A0A0] text-xs1 leading-none'}>{`${service.minutes} min`}</p>
        </span>
        <span className={'flex items-center text-xs1 text-primary font-bold gap-2.5'}>
          <span className={'whitespace-nowrap'}>{`${price} Kč`}</span>
          <ChevronRight />
        </span>
      </Link>
    </li>
  )
}

const BookServicePage = async () => {
  const data: IBookServiceGroup[] = await getBookService()

  return (
    <Accordion type={'multiple'}>
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
