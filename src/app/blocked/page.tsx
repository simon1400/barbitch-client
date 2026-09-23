import type { Metadata } from 'next'

import Button from 'components/Button'
import { Container } from 'components/Container'
import { getContact } from 'fetch/contact'

// Sem vede web rezervace, když server odpoví 403 `blacklisted` (BookForm).
// Stránka o klientovi nic neví a vědět nemá: žádné jméno, číslo ani důvod
// v URL ani na stránce — jen obecné vysvětlení, kontakt a odkaz na zásady.
// Text schválil majitel (s207): pozastavení je rozhodnutí salonu, formulace
// „pro toto telefonní číslo“ (na číslo se mohl objednávat i někdo jiný),
// žádné „blacklist“, žádná obvinění.
//
// Telefon a e-mail z CMS (single-type contact) → ISR místo force-static:
// při výpadku Strapi během buildu by jinak na stránce navždy chyběl kontakt.
export const revalidate = 3600

// Záloha, když CMS neodpoví: člověk na této stránce MUSÍ mít kam zavolat.
const FALLBACK_PHONE = '+420 776 527 194'
const FALLBACK_EMAIL = 'info@barbitch.cz'

export async function generateMetadata(): Promise<Metadata> {
  const title = 'Online rezervace pozastavena | Barbitch'
  const description =
    'Online rezervace pro zadané telefonní číslo je pozastavena. Kontaktujte nás a domluvíme se.'

  return {
    // `absolute` — titulek už značku obsahuje, šablona by ji přidala podruhé.
    title: { absolute: title },
    description,
    robots: { index: false, follow: false },
    openGraph: {
      title,
      siteName: 'Barbitch',
      locale: 'cs_CZ',
      description,
      images: ['https://barbitch.cz/assets/bigBaner.jpg'],
      url: 'https://barbitch.cz/blocked',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['https://barbitch.cz/assets/bigBaner.jpg'],
    },
    // Žádný canonical: stránka je noindex, kanonizovat ji na sebe je protimluv.
  }
}

export default async function Blocked() {
  const contact = await getContact()
  const phone = contact.phone?.trim() || FALLBACK_PHONE
  const email = contact.email?.trim() || FALLBACK_EMAIL
  const textCls = 'text-white text-baseSm md:text-baseText'

  return (
    <main
      className={'min-h-screen flex pt-28 pb-16 md:py-24'}
      style={{
        backgroundImage: 'linear-gradient(0deg, rgba(231,30,110,1) 0%, rgba(255,0,101,0.5) 100%)',
      }}
    >
      <div className={'m-auto text-center relative'}>
        <div
          className={
            'absolute top-[50%] left-[50%] -translate-y-1/2 -translate-x-1/2 w-[660px] h-[578px] -z-10'
          }
        >
          <img src={'/assets/icons/heart.svg'} alt={''} />
        </div>
        <Container size={'lg'}>
          <div className={'mx-auto mb-10 max-w-[760px]'}>
            <h1 className={'mb-8 text-[28px] leading-[1.15] md:text-[44px]'}>
              {'Online rezervace je pro toto telefonní číslo pozastavena'}
            </h1>
            <p className={`${textCls} mb-4`}>
              {
                'Pro zadané telefonní číslo jsme online rezervace dočasně pozastavili. K tomuto kroku přistupujeme zpravidla po opakovaných neomluvených absencích nebo pozdních zrušeních termínu.'
              }
            </p>
            <p className={`${textCls} font-bold`}>
              {
                'Rádi si to s vámi vyjasníme osobně — zavolejte nám nebo napište a domluvíme se, jak dál. Termín vám můžeme založit i telefonicky.'
              }
            </p>
          </div>
          <div className={'mb-10 flex flex-col items-center justify-center gap-3 sm:flex-row'}>
            <Button text={`Zavolat ${phone}`} href={`tel:${phone.replaceAll(' ', '')}`} white />
            <Button text={'Napsat e-mail'} href={`mailto:${email}`} white />
            <Button text={'Zpět na úvod'} href={'/'} />
          </div>
          <p className={'mx-auto max-w-[640px] text-white/85 text-resXs md:text-sm'}>
            {
              'Údaje zpracováváme na základě oprávněného zájmu salonu. Máte právo požádat o informaci, proč byla rezervace pozastavena, a proti tomuto zpracování vznést námitku — stačí napsat na '
            }
            <a className={'underline'} href={`mailto:${email}`}>
              {email}
            </a>
            {'. Více v '}
            <a className={'underline'} href={'/zasady-ochrany-osobnich-udaju'}>
              {'Zásadách ochrany osobních údajů'}
            </a>
            {'.'}
          </p>
        </Container>
      </div>
    </main>
  )
}
