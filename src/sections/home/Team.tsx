import type { ITeamMember } from 'fetch/home'

import Image from 'components/Image'
import { LogoIcon } from 'icons/Logo'
import Link from 'next/link'

import { ArrowRight, BbLink, SECTION_Y, SectionTitle, WRAP } from './ui'

/**
 * „Náš tým“ (s286): mistryně z /api/engine/home/team — jen křestní jméno, fotka
 * a podpis (ruční `publicNote`, jinak podle služeb). Celá karta vede na rezervaci
 * (`bookHref`; výběr konkrétní mistryně v /book zatím neumí — rozhodnutí 13.11).
 * Prázdná odpověď = sekce se nevykreslí.
 */
const Team = ({ team, linkToReserve }: { team: ITeamMember[]; linkToReserve: string }) => {
  if (!team.length) return null

  return (
    <section aria-labelledby={'nas-tym'} className={`bg-accent text-white ${SECTION_Y}`}>
      <div className={`${WRAP} flex flex-col gap-6 lg:gap-11`}>
        <div className={'flex flex-wrap items-end justify-between gap-4'}>
          <div className={'flex flex-col gap-2.5'}>
            <SectionTitle id={'nas-tym'} light>
              {'Náš tým'}
            </SectionTitle>
            <p className={'m-0 text-[15px] lg:text-[18px] font-medium'}>
              {'Mistryně, ke kterým se můžeš objednat.'}
            </p>
          </div>
          <BbLink href={linkToReserve} tone={'white'} className={'hidden lg:inline-flex'}>
            {'Rezervovat termín'}
          </BbLink>
        </div>

        <ul
          className={'m-0 p-0 list-none grid grid-cols-2 gap-x-3.5 gap-y-6 lg:grid-cols-4 lg:gap-6'}
        >
          {team.map((m) => (
            <li key={m.id}>
              <Link
                href={m.bookHref || linkToReserve}
                aria-label={`Rezervovat termín — ${m.name}`}
                className={
                  'group flex flex-col gap-2.5 lg:gap-2 text-white hover:text-white no-underline focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-4 focus-visible:outline-white'
                }
              >
                <span
                  className={
                    'relative block w-full aspect-[3/4] overflow-hidden border-b-[5px] lg:border-b-[6px] border-solid border-primary bg-bb-pink'
                  }
                >
                  {m.photo?.url ? (
                    <Image
                      src={m.photo.url}
                      alt={`${m.name}, mistryně salonu Barbitch`}
                      fill
                      sizes={'(min-width: 1024px) 25vw, 50vw'}
                      loading={'lazy'}
                      className={'object-cover'}
                    />
                  ) : (
                    <span className={'absolute inset-0 flex items-center justify-center p-6'}>
                      <LogoIcon className={'w-full fill-accent opacity-30'} />
                    </span>
                  )}
                </span>
                <span className={'flex items-center justify-between gap-2 lg:gap-3 lg:pt-3'}>
                  <span className={'flex flex-col gap-1 lg:gap-1.5 min-w-0'}>
                    <h3
                      className={
                        'm-0 text-[clamp(14px,4.6vw,19px)] lg:text-[clamp(20px,2.1vw,30px)] leading-none font-extrabold uppercase text-white break-words'
                      }
                    >
                      {m.name}
                    </h3>
                    {!!m.specialization && (
                      <span className={'text-[12px] lg:text-[14px] font-medium'}>
                        {m.specialization}
                      </span>
                    )}
                  </span>
                  <span
                    aria-hidden={'true'}
                    className={
                      'shrink-0 inline-flex items-center justify-center w-10 h-10 lg:w-[52px] lg:h-[52px] bg-white text-accent group-hover:bg-primary group-focus-visible:bg-primary [transition-property:background-color] [transition-duration:200ms]'
                    }
                  >
                    <ArrowRight size={18} className={'lg:w-[22px] lg:h-[22px]'} />
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <BbLink href={linkToReserve} tone={'white'} className={'w-full lg:hidden'}>
          {'Rezervovat termín'}
        </BbLink>
      </div>
    </section>
  )
}

export default Team
