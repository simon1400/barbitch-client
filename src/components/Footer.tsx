'use client'

import type { IDataContact } from 'fetch/contact'

import { usePathname } from 'next/navigation'

import Contact from '../sections/Contact'
import CustomMap from '../sections/Map'

export const Footer = ({ contact }: { contact: IDataContact }) => {
  const pathname = usePathname()

  if (pathname.includes('/book')) {
    return null
  }
  return (
    <footer className={'pt-27 lg:pt-30'}>
      <Contact contact={contact} />
      <CustomMap />
    </footer>
  )
}
