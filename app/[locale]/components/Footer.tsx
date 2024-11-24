'use client'

import type { IDataContact } from 'fetch/contact'

import parse from 'html-react-parser'
import Link from 'next/link'

import { SocNav } from './SocNav'

export const Footer = ({ contact }: { contact: IDataContact }) => {
  return (
    <footer className={'py-23 lg:pt-50 lg:pb-27'}>
      <div className={'container mx-auto w-full max-w-[1400px] px-4'}>
        <h2 className={'text-lg lg:text-xxl text-center mb-5 lg:mb-11.5'}>{'KONTAKT'}</h2>
        <div className={'flex justify-center mb-5 lg:mb-16'}>
          <SocNav items={contact.socItems} />
        </div>
        <div className={'lg:flex justify-between text-xs1 lg:text-base text-center lg:text-left'}>
          <div className={'text-nowrap mb-5 lg:mb-0'}>
            <Link className={'block text-primary underline'} href={`tel:${contact.phone}`}>
              {contact.phone}
            </Link>
            <Link className={'block text-primary underline'} href={`mailto:${contact.email}`}>
              {contact.email}
            </Link>
          </div>
          <div className={'w-full text-center text-nowrap mb-5 lg:mb-0'}>
            {parse(contact.openHours || '')}
          </div>
          <div className={'lg:text-right text-nowrap'}>
            {parse(contact.address || '')}
            <Link
              className={'block text-primary underline'}
              href={contact.linkToMap || '/'}
              target={'_blank'}
            >
              {'google maps'}
            </Link>
          </div>
        </div>
      </div>
      {/* <div>{'mapa'}</div> */}
    </footer>
  )
}
