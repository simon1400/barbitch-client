import type { IPersonalService } from '../fetch/personalService'

import { ChevronRight } from 'icons/ChevronRight'
// import Image from 'next/image'
import Link from 'next/link'

import { getPersonalService } from '../fetch/personalService'

const ProfileImage = ({ src, className }: { src: string; className?: string }) => (
  <span
    className={`block rounded-full overflow-hidden relative border border-[#16161566] ${className}`}
  >
    <img
      className={'absolute object-cover object-center w-full h-full'}
      src={src}
      alt={'icon service'}
    />
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
                    src={
                      item.profile.image?.image
                        ? item.profile.image.thumb
                        : '/assets/bookIcons/master.svg'
                    }
                    className={`min-w-5.5 w-5.5 h-5.5${idx > 0 ? ' -ml-2.5' : ''}`}
                  />
                ))}
              </span>
              <h2 className={'w-full text-xs1 leading-none'}>{'Kdokoliv'}</h2>
              <ChevronRight />
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
                  src={
                    personal.profile.image?.image
                      ? personal.profile.image.thumb
                      : '/assets/bookIcons/master.svg'
                  }
                  className={'min-w-9 w-9 h-9'}
                />
                <h2 className={'w-full text-xs1 leading-none'}>{personal.profile.name}</h2>
                <ChevronRight />
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default BookPersonalPage
