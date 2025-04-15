/* eslint-disable perfectionist/sort-imports */
import type { IBookService, IBookServiceGroup } from './fetch/bookService'

import { ChevronRight } from 'icons/ChevronRight'
import { ClasicRasIcon } from 'icons/book/ClasicRas'
import { ColorRasIcon } from 'icons/book/ColorRas'
import { FirstObociIcon } from 'icons/book/FirstOboci'
import { FiveDayIcon } from 'icons/book/FiveDay'
import { FourObociIcon } from 'icons/book/FourOboci'
import { GelLakIcon } from 'icons/book/GelLak'
import { HubyIcon } from 'icons/book/Huby'
import { HygienaIcon } from 'icons/book/Hygiena'
import { LongIcon } from 'icons/book/Long'
import { MaxiIcon } from 'icons/book/Maxi'
import { SeccondObociIcon } from 'icons/book/SeccondOboci'
import { ThirdObociIcon } from 'icons/book/ThirdOboci'
import { ThreeDIcon } from 'icons/book/ThreeD'
import { TwoDIcon } from 'icons/book/TwoD'
import Link from 'next/link'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

import { getBookService } from './fetch/bookService'

const icons: any = {
  'Hygienická manikúra': <HygienaIcon />,
  'Gel lak manikúra': <GelLakIcon />,
  'Gel lak + francouzská manikúra': <GelLakIcon />,
  'Gel lak + design ': <GelLakIcon />,
  'Prodloužení nehtů': <LongIcon />,
  'Prodloužení + francouzská manikúra': <LongIcon />,
  'Prodloužení + design': <MaxiIcon />,
  'Korekce do 5 dnů': <FiveDayIcon />,
  'Prodloužení řas Classic': <ClasicRasIcon />,
  '2D': <TwoDIcon />,
  '3D': <ThreeDIcon />,
  'Barvení řas': <ColorRasIcon />,
  'Modelování obočí': <FirstObociIcon />,
  'Laminace (+modelování)': <SeccondObociIcon />,
  'Barvení obočí (+modelování)': <ThirdObociIcon />,
  'Laminace + modelování + barvení': <FourObociIcon />,
  'Depilace horního rtu': <HubyIcon />,
}

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
          {icons[service.title]}
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
