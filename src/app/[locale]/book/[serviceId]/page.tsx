import type { IPersonalService } from '../fetch/personalService'

import { ChevronRight } from 'icons/ChevronRight'
import Image from 'next/image'
import Link from 'next/link'

import { getPersonalService } from '../fetch/personalService'

const BookPersonalPage = async ({ params }: any) => {
  const { serviceId } = params
  const data: IPersonalService[] = await getPersonalService(serviceId)
  return (
    <div className={'bg-[#252523] rounded-special-small px-3 pb-0'}>
      <ul>
        <li>
          <Link className={'flex items-center justify-between py-5 px-1 gap-4'} href={''}>
            <span className={'flex'}>
              <span
                className={
                  'block w-5.5 h-5.5 rounded-full overflow-hidden relative border border-[#16161566]'
                }
              >
                <Image
                  className={'object-cover object-center w-full h-full'}
                  src={'/assets/iconService.jpg'}
                  fill
                  alt={'icon service'}
                />
              </span>
              <span
                className={
                  'block w-5.5 h-5.5 rounded-full overflow-hidden relative border border-[#16161566] -ml-2.5'
                }
              >
                <Image
                  className={'object-cover object-center w-full h-full'}
                  src={'/assets/iconService.jpg'}
                  fill
                  alt={'icon service'}
                />
              </span>
            </span>
            <h2 className={'w-full text-xs1 leading-none'}>{'Kdokoliv'}</h2>
            <span>
              <ChevronRight />
            </span>
          </Link>
        </li>
        {data.map((personal: IPersonalService) => (
          <li key={personal.id} className={'border-t-2 border-[#3C3C3C] border-dotted'}>
            <Link
              className={'flex items-center justify-between py-4 px-1 gap-4'}
              href={`/book/${serviceId}/${personal.id}`}
            >
              <span className={'flex'}>
                <span
                  className={
                    'block w-9 h-9 rounded-full overflow-hidden relative border border-[#16161566]'
                  }
                >
                  <Image
                    className={'object-cover object-center w-full h-full'}
                    src={'/assets/iconService.jpg'}
                    fill
                    alt={'icon service'}
                  />
                </span>
              </span>
              <h2 className={'w-full text-xs1 leading-none'}>{personal.profile.name}</h2>
              <span>
                <ChevronRight />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default BookPersonalPage
