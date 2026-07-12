'use client'
import type { IEngineService } from '../fetch/engine'

import Image from 'components/Image'
import Link from 'next/link'
import { useState } from 'react'

interface BookServiceItemProps {
  service: IEngineService
  category: string
  isSelected: boolean
}

export const BookServiceItem = ({ service, category, isSelected }: BookServiceItemProps) => {
  const [showInfo, setShowInfo] = useState(false)

  const handleInfoService = (e: any) => {
    e.preventDefault()
    setShowInfo(!showInfo)
  }

  const handleClick = () => {
    // Сохраняем в sessionStorage для восстановления после возврата
    sessionStorage.setItem(
      'lastBookingState',
      JSON.stringify({
        category,
        serviceId: service.id,
      }),
    )
  }

  return (
    <li className={'border-t-2 border-[#3C3C3C] border-dotted'}>
      <Link
        className={`block hover:bg-[#3C3C3C] duration-200 ${isSelected ? 'bg-[#3C3C3C]' : ''}`}
        href={`/book/${service.id}/extras`}
        onClick={handleClick}
      >
        <div className={'flex py-3.5 px-1 items-center gap-4'}>
          <span className={'w-full'}>
            <h3 className={'text-xs1 leading-5 mb-1.5'}>{service.title}</h3>
            <div className={'flex'}>
              <p className={`text-[#A0A0A0] text-xs1 leading-none`}>
                {`${service.durationMin} min`}
              </p>
              {service.description && (
                <span
                  role={'button'}
                  onClick={(e) => handleInfoService(e)}
                  className={
                    'inline-block ml-2 text-[11px] text-accent font-light bg-[#A0A0A0] leading-none py-0.5 px-2 rounded-xl'
                  }
                >
                  {'info'}
                </span>
              )}
            </div>
          </span>
          <span className={'flex items-center text-xs1 text-primary font-bold gap-2.5 self-start'}>
            <span className={'whitespace-nowrap'}>{`${service.price} Kč`}</span>
            <Image
              src={'/assets/icons/chevronRight.svg'}
              alt={'Chevron right icon'}
              width={16}
              height={16}
              className={'w-auto h-auto'}
            />
          </span>
        </div>
        {showInfo && (
          <p className={'text-[#A0A0A0] text-xss font-normal mb-3.5'}>{service.description}</p>
        )}
      </Link>
    </li>
  )
}
