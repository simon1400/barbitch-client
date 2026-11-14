import type { IDataContact, ISocItem } from 'fetch/contact'

import { getContact, getContactExtras, getLinkToReserve } from 'fetch/contact'
import { LogoIcon } from 'icons/Logo'
import { parseHtml } from 'lib/parseHtml'

import { FooterMap, NotOnKontakt } from './ContactExtras'
import { BbLink, Heart, SectionTitle, WRAP } from './home/ui'

const SOC_LABEL: Record<ISocItem['type'], string> = {
  instagram: 'Instagram',
  tiktok: 'TikTok',
  facebook: 'Facebook',
}

const LABEL = 'm-0 text-[13px] lg:text-[14px] font-medium text-[#ff9dbb]'
const VALUE =
  'm-0 text-[17px] lg:text-[19px] leading-[1.45] font-bold text-white [&_p]:m-0 [&_p]:inline'
const LINK =
  'self-start py-1.5 font-extrabold text-white underline underline-offset-[5px] hover:text-[#ff9dbb]'

/** Růžová páska sociálních sítí (každé slovo odkaz; opakování mimo pořadí Tab). */
const SocRibbon = ({ items }: { items: ISocItem[] }) => {
  const links = [
    ...items.map((i) => ({ label: SOC_LABEL[i.type] || i.type, href: i.link })),
    ...items
      .filter((i) => i.type === 'instagram')
      .map((i) => ({ label: '@barbitch.cz', href: i.link })),
  ].filter((l) => l.href)
  if (!links.length) return null

  const unit = (k: number) => (
    <span key={k} aria-hidden={k > 0 ? 'true' : undefined} className={'flex items-center'}>
      {links.map((l) => (
        <span key={l.label} className={'flex items-center gap-[22px] lg:gap-7 pr-[22px] lg:pr-7'}>
          <a
            href={l.href}
            target={'_blank'}
            rel={'noopener noreferrer'}
            tabIndex={k > 0 ? -1 : undefined}
            className={
              'text-[19px] lg:text-[24px] leading-none font-extrabold uppercase tracking-[0.5px] whitespace-nowrap text-accent hover:text-white no-underline focus-visible:text-white focus-visible:underline focus-visible:underline-offset-4 focus-visible:outline-none'
            }
          >
            {l.label}
          </a>
          <Heart className={'text-accent'} />
        </span>
      ))}
    </span>
  )

  return (
    <nav
      aria-label={'Sociální sítě'}
      className={
        'group/rib w-[120%] -ml-[10%] h-[50px] lg:h-[66px] bg-primary overflow-hidden -rotate-[1.5deg]'
      }
    >
      <div
        className={
          'flex w-max h-full items-center animate-[marquee_80s_linear_infinite] group-hover/rib:[animation-play-state:paused] group-focus-within/rib:[animation-play-state:paused] motion-reduce:animate-none'
        }
      >
        {Array.from({ length: 10 }, (_, k) => unit(k))}
      </div>
    </nav>
  )
}

/**
 * Patička „Kontakt“ pro všechny stránky (s286, varianta C): černá, H2 + tlačítko,
 * čtyři sloupce (adresa, otevírací doba, spojení, cesta) a mapa, růžová páska
 * sociálních sítí, právní řádek a bílé logo přes celou šířku.
 */
const Contact = async () => {
  const [contact, extras, { linkToReserve }]: [
    IDataContact,
    Awaited<ReturnType<typeof getContactExtras>>,
    { linkToReserve: string },
  ] = await Promise.all([getContact(), getContactExtras(), getLinkToReserve()])
  const how = extras.howToGetThere?.trim()

  return (
    <div
      className={
        'bg-accent text-white pt-14 lg:pt-24 overflow-hidden flex flex-col gap-10 lg:gap-14'
      }
    >
      <NotOnKontakt>
        <div className={`${WRAP} flex flex-wrap items-end justify-between gap-5`}>
          <SectionTitle id={'kontakt'} light>
            {'Kontakt'}
          </SectionTitle>
          <BbLink href={linkToReserve} tone={'white'} className={'hidden lg:inline-flex'}>
            {'Rezervovat termín'}
          </BbLink>
        </div>
      </NotOnKontakt>

      <div className={`${WRAP} flex flex-wrap gap-10 lg:gap-14`}>
        <div
          className={
            'flex-[1.2_1_480px] min-w-0 grid grid-cols-2 gap-x-6 gap-y-8 lg:gap-x-8 lg:gap-y-10 content-start'
          }
        >
          <div className={'flex flex-col gap-2'}>
            <h3 className={LABEL}>{'Adresa'}</h3>
            <div className={VALUE}>
              {parseHtml(contact.address || 'Křenová 294/16<br>602 00 Brno', false)}
            </div>
            <a
              href={contact.linkToMap || 'https://maps.app.goo.gl/LWngsct3NGv66d986'}
              target={'_blank'}
              rel={'noopener noreferrer'}
              className={`${LINK} text-[15px] lg:text-[16px]`}
            >
              {'Otevřít v Google Maps'}
            </a>
          </div>
          <div className={'flex flex-col gap-2'}>
            <h3 className={LABEL}>{'Otevírací doba'}</h3>
            <div className={VALUE}>
              {parseHtml(contact.openHours || 'Pondělí–neděle<br>10:00–19:00', false)}
            </div>
          </div>
          <div className={'flex flex-col gap-2 min-w-0'}>
            <h3 className={LABEL}>{'Spojení'}</h3>
            {!!contact.phone && (
              <a
                href={`tel:${contact.phone.replaceAll(' ', '')}`}
                className={`${LINK} text-[17px] lg:text-[19px]`}
              >
                {contact.phone}
              </a>
            )}
            {!!contact.email && (
              <a
                href={`mailto:${contact.email}`}
                className={`${LINK} text-[17px] lg:text-[19px] break-all`}
              >
                {contact.email}
              </a>
            )}
          </div>
          {!!how && (
            <div className={'flex flex-col gap-2'}>
              <h3 className={LABEL}>{'Jak se k nám dostaneš'}</h3>
              <p className={`${VALUE} whitespace-pre-line`}>{how}</p>
            </div>
          )}
        </div>
        <FooterMap mapLink={contact.linkToMap} />
        <NotOnKontakt>
          <BbLink href={linkToReserve} tone={'white'} className={'w-full lg:hidden'}>
            {'Rezervovat termín'}
          </BbLink>
        </NotOnKontakt>
      </div>

      <SocRibbon items={contact.socItems || []} />

      <div className={WRAP}>
        <div
          className={
            'flex flex-col gap-3 lg:flex-row lg:flex-wrap lg:items-center lg:justify-between lg:gap-x-8 pt-6 border-t border-solid border-[#55554f]'
          }
        >
          <p className={'m-0 text-[13px] text-white'}>
            {'Provozovatel: Dmytro Pechunka, IČO 17407613'}
          </p>
          <nav
            aria-label={'Právní informace'}
            className={'flex flex-col lg:flex-row lg:flex-wrap lg:gap-x-6'}
          >
            <a
              className={
                'py-3 text-[13px] text-white underline lg:no-underline hover:text-[#ff9dbb]'
              }
              href={'/zasady-ochrany-osobnich-udaju'}
            >
              {'Zásady ochrany osobních údajů'}
            </a>
            <a
              className={
                'py-3 text-[13px] text-white underline lg:no-underline hover:text-[#ff9dbb]'
              }
              href={'/obchodni-podminky'}
            >
              {'Obchodní podmínky'}
            </a>
            <a
              className={
                'py-3 text-[13px] text-white underline lg:no-underline hover:text-[#ff9dbb]'
              }
              href={'/cookies-policy'}
            >
              {'Zásady používání cookies'}
            </a>
          </nav>
        </div>
      </div>

      <div className={`${WRAP} pb-10 lg:pb-16`}>
        <LogoIcon className={'block w-full h-auto fill-white'} />
      </div>
    </div>
  )
}

export default Contact
