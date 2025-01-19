'use client'

import type { IDataContact } from 'fetch/contact'

import Contact from '../sections/Contact'
import CustomMap from '../sections/Map'

export const Footer = ({ contact }: { contact: IDataContact }) => {
  return (
    <footer className={'pt-27 lg:pt-30'}>
      <Contact contact={contact} />
      <CustomMap />
    </footer>
  )
}
