import type { Metadata } from 'next'

import { formatInTimeZone } from 'date-fns-tz'
import { JUNIOR_DISCOUNT_PERCENT } from 'lib/junior'

import { getEngineHold } from '../../fetch/engine'

import BookForm from './BookForm'
import { ReservationExpired } from './components/ReservationExpired'

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

  let hold: Awaited<ReturnType<typeof getEngineHold>> | null = null
  try {
    hold = await getEngineHold(idReservation)
  } catch {
    // Неизвестный/удалённый холд — движок отдаёт 404.
    hold = null
  }

  const serviceItem = hold?.services?.[0]

  // Холд не найден/истёк (таймер 5 мин) — показываем экран вместо краша.
  if (!hold || hold.expired || !serviceItem) {
    return <ReservationExpired idReservation={idReservation} />
  }

  // Junior-мастер: движок уже применил −20% (price < seniorPrice) — показываем
  // зачёркнутую senior-цену.
  const isJunior = serviceItem.seniorPrice > hold.price

  return (
    <>
      <div
        className={'bg-[#252523] rounded-special-small px-5 pt-3.5 pb-2 text-[14px]/[17px] mb-5'}
      >
        <ul>
          <li className={'flex justify-between py-2.5'}>
            <span className={'text-[#A0A0A0]'}>{'Datum'}</span>
            <span className={'text-white'}>
              {formatInTimeZone(new Date(hold.startsAt), 'Europe/Prague', 'd.M.yyyy HH:mm')}
            </span>
          </li>
          <li className={'flex justify-between py-2.5'}>
            <span className={'text-[#A0A0A0]'}>{'Trvání'}</span>
            <span className={'text-white'}>{`${hold.durationMin} min`}</span>
          </li>
          <li className={'flex justify-between py-2.5 items-center gap-4'}>
            <span className={'text-[#A0A0A0]'}>{'Zaměstnanec'}</span>
            <span className={'text-white flex items-center gap-2 leading-none'}>
              {isJunior && <JuniorBadge />}
              <span>{hold.employee?.name ?? 'Neznámý'}</span>
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
            <span className={'text-white text-right'}>{serviceItem.title}</span>
          </li>
          <li className={'flex justify-between py-5 items-center'}>
            <span className={'text-[#A0A0A0]'}>{'Celková cena'}</span>
            <span className={'flex items-baseline gap-2 whitespace-nowrap'}>
              {isJunior && (
                <span className={'text-xss text-[#A0A0A0] line-through'}>
                  {`${serviceItem.seniorPrice} Kč`}
                </span>
              )}
              <span className={'text-white'}>{`${hold.price} Kč`}</span>
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
