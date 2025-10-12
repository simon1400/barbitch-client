import { formatInTimeZone } from 'date-fns-tz'

import { getComboServiceById } from '../../../fetch/comboService'
import { getSlotReservation } from '../../../fetch/slotReservation'

import ComboBookForm from './ComboBookForm'

export default async function ComboBookServicePage({ params }: any) {
  const { idReservation } = await params

  // Получаем все ID резерваций из localStorage на клиенте
  // Здесь мы получаем только первую резервацию для отображения базовой информации
  const firstReservation = await getSlotReservation(idReservation)

  const eventType = firstReservation.event_types?.[0]

  // Получаем comboId из localStorage (будет доступно на клиенте)
  // Временно используем заглушку, реальные данные будут на клиенте
  const formattedData = {
    date: formatInTimeZone(new Date(firstReservation.starts_at), 'Europe/Prague', 'd.M.yyyy HH:mm'),
    employee: firstReservation.employee?.profile.name ?? 'Неизвестно',
    service: eventType.title,
    origin: 'online',
    channel: 'google maps',
    source: 'quick bookings',
  }

  return (
    <>
      <div
        className={'bg-[#252523] rounded-special-small px-5 pt-3.5 pb-2 text-[14px]/[17px] mb-5'}
      >
        <p className={'text-[#A0A0A0] text-xs mb-3'}>
          {'Комбинированная услуга - детали будут загружены...'}
        </p>
      </div>

      <ComboBookForm idReservation={idReservation} />
    </>
  )
}
