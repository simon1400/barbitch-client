import { format } from 'date-fns'

import { getSlotReservation } from '../../fetch/slotReservation'

import BookForm from './BookForm'

interface Props {
  params: {
    idReservation: string
  }
}

export default async function BookServicePage({ params }: Props) {
  const { idReservation } = await params
  const data = await getSlotReservation(idReservation)

  const eventType = data.event_types?.[0]

  const formattedData = {
    date: format(data.starts_at, 'd.M.yyyy HH:mm'),
    duration: `${eventType.minutes} min`,
    employee: data.employee?.profile.name ?? 'Неизвестно',
    service: eventType.title,
    price: `${eventType.payments?.total_payment ?? 'N/A'} Kč`,
  }

  return (
    <>
      <div
        className={'bg-[#252523] rounded-special-small px-5 pt-3.5 pb-2 text-[14px]/[17px] mb-5'}
      >
        <ul>
          {[
            { label: 'Datum', value: formattedData.date },
            { label: 'Trvání', value: formattedData.duration },
            { label: 'Zaměstnanec', value: formattedData.employee },
            { label: 'Služba', value: formattedData.service, border: true },
            { label: 'Celková cena', value: formattedData.price },
          ].map(({ label, value, border }) => (
            <li
              key={label}
              className={`flex justify-between ${border ? 'border-t-2 border-b-2 border-dotted border-[#3C3C3C] py-5 mt-2.5' : 'py-2.5'} last:py-5`}
            >
              <span className={'text-[#A0A0A0]'}>{label}</span>
              <span className={'text-white'}>{value}</span>
            </li>
          ))}
        </ul>
      </div>

      <BookForm idReservation={idReservation} />
    </>
  )
}
