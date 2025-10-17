'use client'
import type { IComboService } from '../fetch/comboService'

import Link from 'next/link'
import { useState } from 'react'

export const ComboServiceItem = ({ service }: { service: IComboService }) => {
  const [showInfo, setShowInfo] = useState(false)

  const handleInfoService = (e: any) => {
    e.preventDefault()
    setShowInfo(!showInfo)
  }

  return (
    <li className={'border-t-2 border-[#3C3C3C] border-dotted'}>
      <Link className={'block hover:bg-[#3C3C3C] duration-200'} href={`/book/combo/${service.id}`}>
        <div className={'flex py-3.5 px-1 items-center gap-4'}>
          <span
            className={
              'min-w-[36px] w-[36px] h-[36px] overflow-hidden self-start rounded-full block relative bg-[#3C3C3C]'
            }
          >
            {service.image && <img src={service.image} alt={service.title} />}
          </span>
          <span className={'w-full'}>
            <h3 className={'text-xs1 leading-5 mb-1.5'}>{service.title}</h3>
            <div className={'flex items-center'}>
              <p
                className={`text-[#A0A0A0] text-xs1 leading-none`}
              >{`${service.totalMinutes} min`}</p>
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
              {/* Иконка скидки */}
              <span
                className={
                  'inline-flex items-center text-xss justify-center ml-2 bg-primary w-8 h-4 rounded-full'
                }
              >
                {'-%'}
              </span>
            </div>
          </span>
          <span className={'flex items-center text-xs1 text-primary font-bold gap-2.5 self-start'}>
            <span className={'whitespace-nowrap'}>{`${service.price} Kč`}</span>
            <img src={'/assets/icons/chevronRight.svg'} alt={'Chevron right icon'} />
          </span>
        </div>
        {showInfo && (
          <p className={'text-[#A0A0A0] text-xss font-normal mb-3.5'}>{service.description}</p>
        )}
      </Link>
    </li>
  )
}
