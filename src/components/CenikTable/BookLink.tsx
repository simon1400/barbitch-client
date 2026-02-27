import Image from 'next/image'
import Link from 'next/link'

export const BookLink = ({ href }: { href: string }) => (
  <span onClick={(e) => e.stopPropagation()}>
    <Link
      href={href}
      className={'font-bold text-[11px] text-primary hover:underline whitespace-nowrap'}
    >
      <span className={'hidden md:inline'}>{'Rezervovat'}</span>
      <span className={'md:hidden inline-block w-6 h-6'}>
        <Image
          src={'/assets/icons/calendar.svg'}
          alt={'Rezervovat'}
          width={25}
          height={25}
          className={'w-full h-full'}
        />
      </span>
    </Link>
  </span>
)
