'use client'
import type { IDataHomepageService } from 'fetch/service'

import { Hand } from '../components/Hand'
import Link from 'next/link'
import { SmallHandIcon } from 'icons/SmallHand'
import { ArrowRightIcon } from 'icons/ArrowIcon'

export const HandSec = ({ service }: { service: IDataHomepageService[] }) => {
  return (
    <>
      <section className={'hidden lg:block py-11.5'}>
        <div className={'container mx-auto w-full max-w-[1400px] px-4'}>
          <Hand />
        </div>
      </section>
      <section className={'lg:hidden py-16'}>
        <div className={'container mx-auto w-full max-w-[1400px] px-4'}>
          <div className={'pr-16 pl-8 mb-8'}>
            <SmallHandIcon />
          </div>
          <nav>
            <ul>
              {service.map((item: IDataHomepageService) => (
                <li key={item.title} className={'mb-4'}>
                  <Link href={`/${item.slug}`} className={'flex text-md1 uppercase gap-3'}>
                    <span>{item.title}</span>
                    <ArrowRightIcon />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </section>
    </>
  )
}
