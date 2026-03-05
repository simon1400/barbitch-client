'use client'

import { Container } from 'components/Container'
import { usePathname } from 'next/navigation'

export function ContactHeading() {
  const pathname = usePathname()
  if (pathname === '/kontakt') return null
  return <h2 className={'text-md lg:text-big text-center mb-5 lg:mb-11.5'}>{'KONTAKT'}</h2>
}

export function ContactHandIcon() {
  const pathname = usePathname()
  if (pathname !== '/kontakt') return null
  return (
    <section className={'hidden lg:block py-11.5'}>
      <Container size={'sm'} className={'px-11'}>
        <img src={'/assets/icons/smallHand.svg'} alt={'Small hand Barbitch logo icon'} />
      </Container>
    </section>
  )
}
