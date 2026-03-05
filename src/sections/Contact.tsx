import type { IDataContact } from 'fetch/contact'

import { Container } from 'components/Container'
import { SocNav } from 'components/SocNav'
import { getContact } from 'fetch/contact'
import { parseHtml } from 'lib/parseHtml'
import Link from 'next/link'

import { ContactHandIcon, ContactHeading } from './ContactExtras'

const Contact = async () => {
  const contact: IDataContact = await getContact()

  return (
    <section className={'pb-23 lg:pb-27'}>
      <Container size={'xl'}>
        <ContactHeading />
        <div className={'flex justify-center mb-5 lg:mb-16'}>
          <SocNav items={contact.socItems} />
        </div>
        <div className={'lg:flex justify-between text-xs1 lg:text-base text-center lg:text-left'}>
          <div className={'text-nowrap mb-5 lg:mb-0'}>
            <Link
              className={
                'block text-primary underline duration-300 underline-offset-2 hover:underline-offset-4'
              }
              href={`tel:${contact.phone.replaceAll(' ', '')}`}
            >
              {contact.phone}
            </Link>
            <Link
              className={
                'block text-primary underline duration-300 underline-offset-2 hover:underline-offset-4'
              }
              href={`mailto:${encodeURI(contact.email)}`}
            >
              {'Napište nám!'}
            </Link>
          </div>
          <div className={'w-full text-center text-nowrap mb-5 lg:mb-0'}>
            {parseHtml(contact.openHours || '', false)}
          </div>
          <div className={'lg:text-right text-nowrap'}>
            {parseHtml(contact.address || '', false)}
            <Link
              className={
                'block text-primary underline duration-300 underline-offset-2 hover:underline-offset-4'
              }
              href={contact.linkToMap || '/'}
              target={'_blank'}
            >
              {'google maps'}
            </Link>
          </div>
        </div>
        <ContactHandIcon />
      </Container>
    </section>
  )
}

export default Contact
