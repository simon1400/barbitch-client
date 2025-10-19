import Image from 'next/image'

export const BookButton = ({ href }: { href?: string | null }) =>
  href ? (
    <a
      href={href}
      id={'book-button'}
      className={'text-[10px] font-bold text-primary hover:underline'}
    >
      <span className={'hidden md:inline'}>{'Rezervace'}</span>
      <span className={'md:hidden inline-block w-5 h-5'}>
        <Image
          src={'/assets/icons/calendar.svg'}
          alt={'Book calendar icon'}
          width={20}
          height={20}
          className={'w-full h-full'}
        />
      </span>
    </a>
  ) : null
