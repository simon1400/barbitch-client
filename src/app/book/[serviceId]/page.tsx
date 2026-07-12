/* eslint-disable import/order */
import type { Metadata } from 'next'
import type { IEngineEmployee, IEngineService } from '../fetch/engine'

import { MasterIcon } from 'icons/Master'
import { calcJuniorPrice, JUNIOR_DISCOUNT_PERCENT } from 'lib/junior'
import Link from 'next/link'

import {
  calcSelectionPricing,
  engineAssetUrl,
  getEngineEmployees,
  getEngineService,
  selectionFromSearchParams,
  selectionToQuery,
} from '../fetch/engine'

export const metadata: Metadata = {
  title: 'Výběr specialistky | Rezervace – Barbitch Beauty Studio Brno',
  description: 'Vyberte si specialistku pro vaši rezervaci v Barbitch Beauty Studiu v Brně.',
  robots: { index: false, follow: false },
}

const ProfileImage = ({ src, className }: { src: string | null; className?: string }) => (
  <span
    className={`block rounded-full overflow-hidden relative border border-[#16161566] ${className}`}
  >
    {src ? (
      <img
        className={'absolute object-cover object-center w-full h-full'}
        src={src}
        alt={'Icon service book'}
      />
    ) : (
      <MasterIcon />
    )}
  </span>
)

const JuniorBadge = () => (
  <span
    className={
      'shrink-0 text-[10px] leading-none font-semibold text-[#E71E6E] bg-[#E71E6E1A] border border-[#E71E6E40] rounded-xl px-1.5 py-1 whitespace-nowrap'
    }
  >
    {`Junior -${JUNIOR_DISCOUNT_PERCENT}%`}
  </span>
)

const JuniorPrice = ({
  seniorPrice,
  juniorPrice,
}: {
  seniorPrice: number
  juniorPrice: number
}) => (
  <span className={'shrink-0 flex flex-col items-end leading-none whitespace-nowrap'}>
    {seniorPrice > juniorPrice && (
      <span
        className={'text-[10px] text-[#A0A0A0] line-through mb-0.5'}
      >{`${seniorPrice} Kč`}</span>
    )}
    <span className={'text-xs1 text-primary font-bold'}>{`${juniorPrice} Kč`}</span>
  </span>
)

// Оба запроса идут в наш движок; на сетевой сбой/5xx не роняем Server Component.
const fetchData = async (
  serviceId: string,
): Promise<{ service: IEngineService | null; employees: IEngineEmployee[]; failed: boolean }> => {
  try {
    const [service, employees] = await Promise.all([
      getEngineService(serviceId),
      getEngineEmployees(serviceId),
    ])
    return { service, employees, failed: false }
  } catch {
    return { service: null, employees: [], failed: true }
  }
}

const BookPersonalPage = async ({ params, searchParams }: any) => {
  const { serviceId } = await params
  const selection = selectionFromSearchParams((await searchParams) ?? {})

  const { service, employees, failed } = await fetchData(serviceId)

  // Нет мастеров: либо движок временно недоступен (failed) — просим попробовать
  // позже, либо услуга реально без назначенных мастеров — предлагаем другую.
  if (!service || employees.length === 0) {
    return (
      <div className={'bg-[#252523] rounded-special-small px-5 py-10 text-center'}>
        <h2 className={'text-xs1 leading-snug mb-5'}>
          {failed
            ? 'Rezervační systém je momentálně nedostupný. Zkuste to prosím za chvíli.'
            : 'Pro tuto službu nejsou dostupné žádné specialistky. Vyberte si prosím jinou službu.'}
        </h2>
        <Link
          className={
            'inline-block bg-primary text-white text-xs1 font-bold rounded-special-small px-6 py-3'
          }
          href={'/book'}
        >
          {'Zpět na výběr služby'}
        </Link>
      </div>
    )
  }

  // Junior-цена — превью для выбранной комбинации (сервер посчитает то же самое в холде)
  const { seniorPrice } = calcSelectionPricing(service, selection)
  const juniorPrice = calcJuniorPrice(seniorPrice)
  const qs = selectionToQuery(selection)

  return (
    <div className={'bg-[#252523] rounded-special-small px-3 pb-0'}>
      <ul>
        {/* Kdokoliv — мастера выберет движок (балансировка по загрузке + буст приоритета);
            junior −20% применится автоматически, если выпадет junior-мастер. */}
        {employees.length > 1 && (
          <li>
            <Link
              className={'flex items-center justify-between py-5 px-1 gap-4'}
              href={`/book/${service.id}/any${qs}`}
            >
              <span className={'flex'}>
                {[employees[0], employees[1]].map((item, idx) => (
                  <ProfileImage
                    key={item.documentId}
                    src={engineAssetUrl(item.photoUrl)}
                    className={`min-w-5.5 w-5.5 h-5.5${idx > 0 ? ' -ml-2.5' : ''}`}
                  />
                ))}
              </span>
              <h2 className={'w-full text-xs1 leading-none'}>{'Kdokoliv'}</h2>
              <img src={'/assets/icons/chevronRight.svg'} alt={'Chevron right icon'} />
            </Link>
          </li>
        )}

        {employees.map((personal) => (
          <li
            key={personal.documentId}
            className={'border-t-2 first:border-t-0 border-[#3C3C3C] border-dotted'}
          >
            <Link
              className={'flex items-center py-4 px-1 gap-4'}
              href={`/book/${service.id}/${personal.documentId}${qs}`}
            >
              <ProfileImage
                src={engineAssetUrl(personal.photoUrl)}
                className={'min-w-10 w-10 h-10'}
              />
              <span className={'flex-1 flex items-center gap-2 min-w-0'}>
                <h2 className={'text-xs1 leading-none'}>{personal.name}</h2>
                {personal.tier === 'junior' && <JuniorBadge />}
              </span>
              {personal.tier === 'junior' && (
                <JuniorPrice seniorPrice={seniorPrice} juniorPrice={juniorPrice} />
              )}
              <img src={'/assets/icons/chevronRight.svg'} alt={'Chevron right icon'} />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default BookPersonalPage
