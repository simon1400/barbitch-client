import type { Metadata } from 'next'

import { formatInTimeZone } from 'date-fns-tz'
import { JUNIOR_DISCOUNT_PERCENT } from 'lib/junior'

import { getJuniorMapByJuniorId } from '../../fetch/juniorMap'
import { getSlotReservation } from '../../fetch/slotReservation'

import BookForm from './BookForm'

export const metadata: Metadata = {
  title: 'Dokončení rezervace | Barbitch Beauty Studio Brno',
  description: 'Zadejte své kontaktní údaje a dokončete rezervaci v Barbitch Beauty Studiu v Brně.',
  robots: { index: false, follow: false },
}

const JuniorBadge = () => (
  <span
    className={
      'inline-block text-[10px] leading-none font-semibold text-[#E71E6E] bg-[#E71E6E1A] border border-[#E71E6E40] rounded-xl px-1.5 py-1 whitespace-nowrap'
    }
  >
    {`Junior -${JUNIOR_DISCOUNT_PERCENT}%`}
  </span>
)

export default async function BookServicePage({ params }: any) {
  const { idReservation } = await params
  const data = await getSlotReservation(idReservation)

  const eventType = data.event_types?.[0]

  // Если выбранный event_type — junior-вариант, маппинг вернёт senior_price для зачёркивания
  const juniorMap = eventType?.id ? await getJuniorMapByJuniorId(eventType.id) : null
  const isJunior = juniorMap !== null

  const totalPrice = eventType.payments?.total_payment
  const seniorPrice = juniorMap?.senior_price

  return (
    <>
      <div
        className={'bg-[#252523] rounded-special-small px-5 pt-3.5 pb-2 text-[14px]/[17px] mb-5'}
      >
        <ul>
          <li className={'flex justify-between py-2.5'}>
            <span className={'text-[#A0A0A0]'}>{'Datum'}</span>
            <span className={'text-white'}>
              {formatInTimeZone(new Date(data.starts_at), 'Europe/Prague', 'd.M.yyyy HH:mm')}
            </span>
          </li>
          <li className={'flex justify-between py-2.5'}>
            <span className={'text-[#A0A0A0]'}>{'Trvání'}</span>
            <span className={'text-white'}>{`${eventType.minutes} min`}</span>
          </li>
          <li className={'flex justify-between py-2.5 items-center gap-4'}>
            <span className={'text-[#A0A0A0]'}>{'Zaměstnanec'}</span>
            <span className={'text-white flex items-center gap-2 leading-none'}>
              {isJunior && <JuniorBadge />}
              <span>{data.employee?.profile.name ?? 'Neznámý'}</span>
            </span>
          </li>
          {isJunior && (
            <li className={'pb-2.5'}>
              <p className={'text-[11px] text-[#A0A0A0] leading-snug font-normal'}>
                <span className={'font-bold text-[#E71E6E]'}>{'Junior master'}</span>
                {
                  ' — mistrová s menší praxí, proto procedury mohou trvat o něco déle. Všechny služby jsou prováděny v souladu se standardy salonu a s kvalitními materiály 💕'
                }
              </p>
            </li>
          )}
          <li
            className={
              'flex justify-between border-t-2 border-b-2 border-dotted border-[#3C3C3C] py-5 mt-2.5'
            }
          >
            <span className={'text-[#A0A0A0]'}>{'Služba'}</span>
            <span className={'text-white'}>{eventType.title}</span>
          </li>
          <li className={'flex justify-between py-5 items-center'}>
            <span className={'text-[#A0A0A0]'}>{'Celková cena'}</span>
            <span className={'flex items-baseline gap-2 whitespace-nowrap'}>
              {isJunior && typeof seniorPrice === 'number' && seniorPrice > 0 && (
                <span className={'text-xss text-[#A0A0A0] line-through'}>{`${seniorPrice} Kč`}</span>
              )}
              <span className={'text-white'}>
                {typeof totalPrice === 'number' ? `${totalPrice} Kč` : 'N/A'}
              </span>
            </span>
          </li>
          <li className={'text-[11px]'}>
            <span className={'text-[#A0A0A0]'}>{'Platba - hotově nebo kartou na pobočce'}</span>
          </li>
        </ul>
      </div>

      <BookForm idReservation={idReservation} />
    </>
  )
}
