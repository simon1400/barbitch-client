import type { Metadata } from 'next'
import type { IPersonalService } from '../fetch/personalService'

import { MasterIcon } from 'icons/Master'
import Link from 'next/link'

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

const BookPersonalPage = async ({ params }: any) => {
  const { serviceId } = await params
  const data: IPersonalService[] = await getPersonalService(serviceId)

  return (
    <div className={'bg-[#252523] rounded-special-small px-3 pb-0'}>
      <ul>
        {data.length > 1 && (
          <li>
            <Link
              className={'flex items-center justify-between py-5 px-1 gap-4'}
              href={`/book/${serviceId}/any`}
            >
              <span className={'flex'}>
                {[data[0], data[1]].map((item, idx) => (
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
        {data.map((personal) => {
          return (
            <li
              key={personal.id}
              className={'border-t-2 first:border-t-0 border-[#3C3C3C] border-dotted'}
            >
              <Link
                className={'flex items-center justify-between py-4 px-1 gap-4'}
                href={`/book/${serviceId}/${personal.id}`}
              >
                <ProfileImage
                  src={personal.profile.image?.image ? personal.profile.image.thumb : undefined}
                  className={'min-w-10 w-10 h-10'}
                />
                <h2 className={'w-full text-xs1 leading-none'}>{personal.profile.name}</h2>
                <img src={'/assets/icons/chevronRight.svg'} alt={'Chevron right icon'} />
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default BookPersonalPage
