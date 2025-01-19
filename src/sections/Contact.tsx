import type { IDataContact } from 'fetch/contact'

import { SocNav } from 'components/SocNav'
import parse from 'html-react-parser'
import { SmallHandIcon } from 'icons/SmallHand'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const Contact = ({ contact }: { contact: IDataContact }) => {
  const pathname = usePathname()

  return (
    <section className={'container mx-auto w-full max-w-[1400px] px-4 pb-23 lg:pb-27'}>
      {pathname !== '/kontakt' && (
        <h2 className={'text-md lg:text-xxl text-center mb-5 lg:mb-11.5'}>{'KONTAKT'}</h2>
      )}
      <div className={'flex justify-center mb-5 lg:mb-16'}>
        <SocNav items={contact.socItems} />
      </div>
      <div className={'lg:flex justify-between text-xs1 lg:text-base text-center lg:text-left'}>
        <div className={'text-nowrap mb-5 lg:mb-0'}>
          <Link
            className={
              'block text-primary underline duration-300 underline-offset-2 hover:underline-offset-4'
            }
            href={`tel:${contact.phone}`}
          >
            {contact.phone}
          </Link>
          <Link
            className={
              'block text-primary underline duration-300 underline-offset-2 hover:underline-offset-4'
            }
            href={`mailto:${contact.email}`}
          >
            {contact.email}
          </Link>
        </div>
        <div className={'w-full text-center text-nowrap mb-5 lg:mb-0'}>
          {parse(contact.openHours || '')}
        </div>
        <div className={'lg:text-right text-nowrap'}>
          {parse(contact.address || '')}
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
      {pathname === '/kontakt' && (
        <section className={'hidden lg:block py-11.5'}>
          <div className={'container mx-auto w-full max-w-[650px] px-11'}>
            <SmallHandIcon />
          </div>
        </section>
      )}
    </section>
  )
}

export default Contact
