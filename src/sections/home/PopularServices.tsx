import type { IPopularService } from 'fetch/home'
import type { IGalleryItem } from 'fetch/homepage'

import Image from 'components/Image'
import { resolveBookSection } from 'lib/bookSection'
import { formatKc } from 'lib/homeContent'
import Link from 'next/link'

import { SectionTitle, Sparkle, TextLink, WRAP } from './ui'

const TILTS = ['-rotate-[1.5deg]', 'rotate-[1.2deg]', '-rotate-[0.8deg]', 'rotate-[1.6deg]']

/** „1D (Classic)“ → „Prodloužení řas 1D Classic“ — samotné „2D“ na dlaždici nic neřekne. */
const displayTitle = (title: string, section: string | null) =>
  section === 'Prodluzovani_ras' && /^\d+D\b/.test(title)
    ? `Prodloužení řas ${title.replaceAll(/[()]/g, '').replaceAll(/\s+/g, ' ').trim()}`
    : title

/**
 * Fotka dlaždice: fotky galerie „Naše práce“ se stejnou sekcí /book; druhá
 * dlaždice téže sekce dostane další fotku. Žádná fotka = dlaždice jen v přechodu.
 */
const photoPicker = (gallery: IGalleryItem[]) => {
  const used = new Map<string, number>()
  return (section: string | null) => {
    if (!section) return null
    const pool = gallery.filter(
      (g) => resolveBookSection(g.bookingSection, g.service?.slug ?? undefined) === section,
    )
    if (!pool.length) return null
    const i = used.get(section) ?? 0
    used.set(section, i + 1)
    return pool[i % pool.length].image
  }
}

/**
 * „Nejoblíbenější služby“ (s286): čtyři nejčastěji rezervované služby za
 * posledních 30 dní (/api/engine/home/popular-services, max. 2 z jedné skupiny).
 * Celá dlaždice je odkaz na krok rezervace té služby.
 */
const PopularServices = ({
  services,
  gallery,
}: {
  services: IPopularService[]
  gallery: IGalleryItem[]
}) => {
  if (!services.length) return null
  const photoFor = photoPicker(gallery)

  return (
    <section aria-labelledby={'oblibene'} className={'bg-white pt-14 pb-16 lg:pt-24 lg:pb-[110px]'}>
      <div className={`${WRAP} flex flex-col gap-6 lg:gap-12`}>
        <div className={'flex flex-wrap items-end justify-between gap-3'}>
          <SectionTitle id={'oblibene'}>{'Nejoblíbenější služby'}</SectionTitle>
          <TextLink href={'/cenik'}>{'Celý ceník'}</TextLink>
        </div>
        <ul className={'m-0 p-0 list-none grid grid-cols-2 gap-3.5 lg:grid-cols-4 lg:gap-6'}>
          {services.map((s, i) => {
            const title = displayTitle(s.title, s.bookingSection)
            const photo = photoFor(s.bookingSection)
            return (
              <li key={s.id} className={TILTS[i % TILTS.length]}>
                <Link
                  href={s.bookHref}
                  aria-label={`Rezervovat: ${title}, ${s.from ? 'od ' : ''}${formatKc(s.price)}`}
                  className={
                    'group relative flex h-full flex-col justify-between gap-5 lg:gap-9 min-h-[230px] lg:min-h-[380px] box-border p-4 lg:p-5 xl:p-7 bg-bb-pink text-accent hover:text-accent no-underline overflow-hidden focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-4 focus-visible:outline-accent'
                  }
                >
                  {photo?.url && (
                    <Image
                      src={photo.url}
                      alt={''}
                      fill
                      sizes={'(min-width: 1024px) 25vw, 50vw'}
                      loading={'lazy'}
                      className={
                        'object-cover opacity-50 [filter:grayscale(1)_contrast(1.1)] mix-blend-screen'
                      }
                    />
                  )}
                  <Sparkle
                    size={26}
                    className={'hidden xl:block top-[22px] left-[calc(100%-50px)]'}
                  />
                  <span className={'relative flex flex-col gap-1.5 lg:gap-2.5'}>
                    <span
                      className={
                        'text-[11px] lg:text-[13px] tracking-[1px] lg:tracking-[1.5px] font-extrabold uppercase'
                      }
                    >
                      {s.category}
                    </span>
                    <h3
                      className={
                        'm-0 xl:max-w-[85%] text-[16px] lg:text-[clamp(17px,1.8vw,26px)] leading-[1.1] lg:leading-[1.08] font-extrabold uppercase'
                      }
                    >
                      {title}
                    </h3>
                    {!!s.durationMin && (
                      <span
                        className={'text-[12px] lg:text-[14px] font-bold'}
                      >{`${s.durationMin} min`}</span>
                    )}
                  </span>
                  <span className={'relative flex flex-col gap-2 lg:gap-4'}>
                    {/* „od“ nad cenou — čtyřmístná cena („1 100 Kč“) se s ním na řádek nevejde */}
                    <span className={'flex flex-col'}>
                      {s.from && (
                        <span className={'text-[13px] lg:text-[16px] font-extrabold'}>{'od'}</span>
                      )}
                      <span
                        className={
                          'whitespace-nowrap text-[clamp(24px,7.5vw,32px)] lg:text-[clamp(40px,3.9vw,58px)] leading-[0.9] font-extrabold tracking-[-1px] lg:tracking-[-2px]'
                        }
                      >
                        {formatKc(s.price)}
                      </span>
                    </span>
                    <span
                      className={
                        'text-[13px] font-extrabold uppercase underline underline-offset-4 lg:no-underline lg:inline-flex lg:items-center lg:justify-center lg:h-12 lg:w-full lg:bg-accent lg:text-white lg:text-[14px] lg:group-hover:text-primary [transition-duration:200ms]'
                      }
                    >
                      {'Rezervovat'}
                    </span>
                  </span>
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}

export default PopularServices
