import type { IBookService, IBookServiceGroup } from './fetch/bookService'

import Link from 'next/link'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

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
          className={
            'min-w-[36px] w-[36px] h-[36px] overflow-hidden self-start rounded-full block relative'
          }
        >
          {!!service.images && <img src={service.images[0].image} alt={service.title} />}
        </span>
        <span className={'w-full'}>
          <h3 className={'text-xs1 leading-5 mb-1.5'}>
            {service.title}
            {/* <span
              role={'button'}
              onClick={(e) => handleInfoService(e)}
              className={'inline-block ml-2 text-[11px] bg-[#A0A0A0] py-1 px-2 rounded-xl'}
            >
              {'info'}
            </span> */}
          </h3>
          <p
            className={`text-[#A0A0A0] text-xs1 leading-none ${service.description ? 'mb-1.5' : ''}`}
          >{`${service.minutes} min`}</p>
          <p className={'text-[#A0A0A0] text-xss font-normal'}>{service.description}</p>
        </span>
        <span className={'flex items-center text-xs1 text-primary font-bold gap-2.5'}>
          <span className={'whitespace-nowrap'}>{`${price} Kč`}</span>
          <img src={'/assets/icons/chevronRight.svg'} alt={'Chevron right icon'} />
        </span>
      </Link>
    </li>
  )
}

const BookServicePage = async () => {
  const data: IBookServiceGroup[] = await getBookService()

  return (
    <Accordion type={'multiple'} defaultValue={data.map((item) => item.title)}>
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
