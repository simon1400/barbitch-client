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
      {/* Ikona jako CSS pozadí, ne <img alt=""> — Bing prázdný alt hlásí jako chybějící
         (desítky na /cenik a stránkách služeb). Text odkazu nese `aria-label`. */}
      <span
        aria-hidden={'true'}
        className={
          "md:hidden inline-block w-6 h-6 bg-[url('/assets/icons/calendar.svg')] bg-contain bg-center bg-no-repeat"
        }
      />
    </Link>
  </span>
)
