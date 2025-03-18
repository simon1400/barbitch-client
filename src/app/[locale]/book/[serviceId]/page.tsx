import type { IPersonalService } from '../fetch/personalService'

import { ChevronRight } from 'icons/ChevronRight'
import Image from 'next/image'
import Link from 'next/link'

import { getPersonalService } from '../fetch/personalService'

const ProfileImage = ({ src, className }: { src: string; className?: string }) => (
  <span
    className={`block rounded-full overflow-hidden relative border border-[#16161566] ${className}`}
  >
    <Image
      className={'object-cover object-center w-full h-full'}
      src={src}
      fill
      alt={'icon service'}
    />
  </span>
)

const BookPersonalPage = async ({ params }: { params: { serviceId: string } }) => {
  const { serviceId } = await params
  const data: IPersonalService[] = (await getPersonalService(serviceId)) ?? []

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
                <ProfileImage src={'/assets/iconService.jpg'} className={'w-5.5 h-5.5'} />
                <ProfileImage src={'/assets/iconService.jpg'} className={'w-5.5 h-5.5 -ml-2.5'} />
              </span>
              <h2 className={'w-full text-xs1 leading-none'}>{'Kdokoliv'}</h2>
              <ChevronRight />
            </Link>
          </li>
        )}
        {data.map((personal) => (
          <li key={personal.id} className={'border-t-2 border-[#3C3C3C] border-dotted'}>
            <Link
              className={'flex items-center justify-between py-4 px-1 gap-4'}
              href={`/book/${serviceId}/${personal.id}`}
            >
              <ProfileImage src={'/assets/iconService.jpg'} className={'w-9 h-9'} />
              <h2 className={'w-full text-xs1 leading-none'}>{personal.profile.name}</h2>
              <ChevronRight />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default BookPersonalPage
