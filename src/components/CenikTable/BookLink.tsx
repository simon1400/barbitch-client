import Image from 'components/Image'
import Link from 'next/link'

export const BookLink = ({ href, service }: { href: string; service: string }) => (
  <span onClick={(e) => e.stopPropagation()}>
    {/* Na /cenik je desítky stejných odkazů „Rezervovat“ mířících jinam —
       `aria-label` je rozliší pro čtečku i pro analýzu odkazového textu. */}
    <Link
      href={href}
      aria-label={`Rezervovat: ${service}`}
      className={'font-bold text-[11px] text-primary hover:underline whitespace-nowrap'}
    >
      <span className={'hidden md:inline'}>{'Rezervovat'}</span>
      <span className={'md:hidden inline-block w-6 h-6'}>
        <Image
          src={'/assets/icons/calendar.svg'}
          alt={''}
          width={25}
          height={25}
          className={'w-full h-full'}
        />
      </span>
    </Link>
  </span>
)
