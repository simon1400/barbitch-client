/* eslint-disable import/order */
import type { Metadata } from 'next'
import type { IPersonalService } from '../fetch/personalService'

import { MasterIcon } from 'icons/Master'
import { JUNIOR_DISCOUNT_PERCENT } from 'lib/junior'
import Link from 'next/link'

import { getJuniorMapForSenior, getJuniorPersonals } from '../fetch/juniorMap'
import { getPersonalService } from '../fetch/personalService'

export const metadata: Metadata = {
  title: 'Výběr specialistky | Rezervace – Barbitch Beauty Studio Brno',
  description: 'Vyberte si specialistku pro vaši rezervaci v Barbitch Beauty Studiu v Brně.',
  robots: { index: false, follow: false },
}

const ProfileImage = ({ src, className }: { src: string; className?: string }) => (
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
  seniorPrice?: number
  juniorPrice?: number
}) => {
  if (typeof juniorPrice !== 'number' || juniorPrice <= 0) return null
  return (
    <span className={'shrink-0 flex flex-col items-end leading-none whitespace-nowrap'}>
      {typeof seniorPrice === 'number' && seniorPrice > juniorPrice && (
        <span className={'text-[10px] text-[#A0A0A0] line-through mb-0.5'}>
          {`${seniorPrice} Kč`}
        </span>
      )}
      <span className={'text-xs1 text-primary font-bold'}>{`${juniorPrice} Kč`}</span>
    </span>
  )
}

interface MergedPersonal extends IPersonalService {
  isJunior: boolean
}

const BookPersonalPage = async ({ params }: any) => {
  const { serviceId } = await params

  // Параллельно: senior-мастера для текущей услуги, junior-маппинг, список junior personals
  const [seniorMasters, juniorMap, juniorPersonals] = await Promise.all([
    getPersonalService(serviceId),
    getJuniorMapForSenior(serviceId),
    getJuniorPersonals(),
  ])

  // Если есть junior-копия услуги — догружаем junior-мастеров отдельным запросом
  let juniorMasters: IPersonalService[] = []
  if (juniorMap?.junior_noona_id) {
    try {
      juniorMasters = await getPersonalService(juniorMap.junior_noona_id)
    } catch {
      juniorMasters = []
    }
  }

  const juniorTierIds = new Set(
    juniorPersonals.filter((p) => p.tier === 'junior').map((p) => p.noonaEmployeeId),
  )

  // Senior список + junior список, дедупликация по personal.id
  // Junior-мастера из senior-списка убираем (защита: tier=junior определяет, junior он или senior, а не Noona skills)
  const merged: MergedPersonal[] = []
  const seen = new Set<string>()
  for (const m of seniorMasters) {
    if (seen.has(m.id)) continue
    if (juniorTierIds.has(m.id)) continue
    seen.add(m.id)
    merged.push({ ...m, isJunior: false })
  }
  for (const m of juniorMasters) {
    if (seen.has(m.id)) continue
    if (!juniorTierIds.has(m.id)) continue
    seen.add(m.id)
    merged.push({ ...m, isJunior: true })
  }

  const hasJuniorOption = juniorMap !== null && juniorMasters.length > 0

  const buildHref = (item: MergedPersonal): string => {
    if (item.isJunior && juniorMap) {
      return `/book/${juniorMap.junior_noona_id}/${item.id}`
    }
    return `/book/${serviceId}/${item.id}`
  }

  return (
    <div className={'bg-[#252523] rounded-special-small px-3 pb-0'}>
      <ul>
        {/* Kdokoliv (senior) */}
        {seniorMasters.length > 1 && (
          <li>
            <Link
              className={'flex items-center justify-between py-5 px-1 gap-4'}
              href={`/book/${serviceId}/any`}
            >
              <span className={'flex'}>
                {[seniorMasters[0], seniorMasters[1]].map((item, idx) => (
                  <ProfileImage
                    key={item.id}
                    src={item.profile.image?.image ? item.profile.image.thumb : undefined}
                    className={`min-w-5.5 w-5.5 h-5.5${idx > 0 ? ' -ml-2.5' : ''}`}
                  />
                ))}
              </span>
              <h2 className={'w-full text-xs1 leading-none'}>{'Kdokoliv'}</h2>
              <img src={'/assets/icons/chevronRight.svg'} alt={'Chevron right icon'} />
            </Link>
          </li>
        )}

        {/* Kdokoliv (junior) — если есть junior-вариант услуги и хотя бы один junior мастер */}
        {hasJuniorOption && juniorMasters.length > 1 && (
          <li className={'border-t-2 border-[#3C3C3C] border-dotted'}>
            <Link
              className={'flex items-center py-5 px-1 gap-4'}
              href={`/book/${juniorMap!.junior_noona_id}/any`}
            >
              <span className={'flex'}>
                {[juniorMasters[0], juniorMasters[1]].map((item, idx) => (
                  <ProfileImage
                    key={item.id}
                    src={item.profile.image?.image ? item.profile.image.thumb : undefined}
                    className={`min-w-5.5 w-5.5 h-5.5${idx > 0 ? ' -ml-2.5' : ''}`}
                  />
                ))}
              </span>
              <span className={'flex-1 flex items-center gap-2 min-w-0'}>
                <h2 className={'text-xs1 leading-none'}>{'Kdokoliv (junior)'}</h2>
                <JuniorBadge />
              </span>
              <JuniorPrice
                seniorPrice={juniorMap?.senior_price}
                juniorPrice={juniorMap?.junior_price}
              />
              <img src={'/assets/icons/chevronRight.svg'} alt={'Chevron right icon'} />
            </Link>
          </li>
        )}

        {merged.map((personal) => (
          <li
            key={personal.id}
            className={'border-t-2 first:border-t-0 border-[#3C3C3C] border-dotted'}
          >
            <Link
              className={'flex items-center py-4 px-1 gap-4'}
              href={buildHref(personal)}
            >
              <ProfileImage
                src={personal.profile.image?.image ? personal.profile.image.thumb : undefined}
                className={'min-w-10 w-10 h-10'}
              />
              <span className={'flex-1 flex items-center gap-2 min-w-0'}>
                <h2 className={'text-xs1 leading-none'}>{personal.profile.name}</h2>
                {personal.isJunior && <JuniorBadge />}
              </span>
              {personal.isJunior && (
                <JuniorPrice
                  seniorPrice={juniorMap?.senior_price}
                  juniorPrice={juniorMap?.junior_price}
                />
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
