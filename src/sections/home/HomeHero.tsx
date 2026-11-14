import type { IHomeImage } from 'fetch/home'

import imageLoader from 'lib/image-loader'
import { getImageProps } from 'next/image'
import Link from 'next/link'

import { BbLink, Sparkle, WRAP } from './ui'

/**
 * Hero hlavní stránky (s286): růžový přechod, fotka stěny salonu přes `screen`
 * (nikdy `multiply` — zčervená), H1 se SEO titulkem, slogan jako <p>, lead, tlačítka
 * a černý pruh faktů. Výška podle obsahu. Fotka je LCP → `fetchPriority=high`.
 *
 * Fotku vymění majitel ve Strapi (`homepage.heroImage` / `heroImageMobile`);
 * prázdné pole = soubory z `public/assets/home/`.
 */

const FALLBACK_DESKTOP = { url: '/assets/home/hero-wall.jpg', width: 1920, height: 700 }
const FALLBACK_MOBILE = { url: '/assets/home/hero-wall-m.jpg', width: 1620, height: 580 }

const pick = (img: IHomeImage | null | undefined, fallback: typeof FALLBACK_DESKTOP) =>
  img?.url && img.width && img.height
    ? { url: img.url, width: img.width, height: img.height, alt: img.alternativeText }
    : { ...fallback, alt: null }

interface HeroFacts {
  address: string
  openHours: string
  phone: string
}

const Fact = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className={'flex flex-col gap-1 py-4 lg:py-[26px]'}>
    <dt className={'text-[13px] font-medium text-[#ff9dbb]'}>{label}</dt>
    <dd className={'m-0 text-[14px] lg:text-[18px] font-bold text-white'}>{children}</dd>
  </div>
)

export const HomeHero = ({
  seoTitle,
  slogan,
  lead,
  heroImage,
  heroImageMobile,
  linkToReserve,
  facts,
}: {
  seoTitle: string
  slogan: string
  lead: string
  heroImage?: IHomeImage | null
  heroImageMobile?: IHomeImage | null
  linkToReserve: string
  facts: HeroFacts
}) => {
  const desktop = pick(heroImage, FALLBACK_DESKTOP)
  // Bez vlastní mobilní fotky ve Strapi: mobil dostane tutéž desktopovou z CMS
  // (oříznutou), ne starý soubor — jinak by po výměně fotky mobil ukazoval starou stěnu.
  const mobile = heroImageMobile?.url
    ? pick(heroImageMobile, FALLBACK_MOBILE)
    : heroImage?.url
      ? desktop
      : pick(null, FALLBACK_MOBILE)
  const alt = desktop.alt || 'Růžová stěna salonu Barbitch s logem'

  const common = { alt, loader: imageLoader, quality: 75, priority: true }
  const {
    props: { srcSet: desktopSrcSet },
  } = getImageProps({
    ...common,
    src: desktop.url,
    width: desktop.width,
    height: desktop.height,
    sizes: '100vw',
  })
  const { props: mobileProps } = getImageProps({
    ...common,
    src: mobile.url,
    width: mobile.width,
    height: mobile.height,
    sizes: '100vw',
  })

  const [first, ...rest] = slogan.trim().split(/\s+/)

  return (
    <section aria-labelledby={'home-h1'} className={'relative overflow-hidden'}>
      <div className={'relative overflow-hidden bg-bb-pink'}>
        <picture>
          <source media={'(min-width: 1024px)'} srcSet={desktopSrcSet} sizes={'100vw'} />
          <img
            {...mobileProps}
            // Mobil: proužek dole (36 % výšky), maska shora; desktop: celé pozadí, maska zleva.
            className={
              'absolute left-0 bottom-0 block w-full h-[36%] object-cover object-[12%_center] opacity-80 [filter:grayscale(1)_contrast(1.15)] mix-blend-screen [mask-image:linear-gradient(180deg,transparent_0%,#000_40%)] lg:top-0 lg:h-full lg:object-[right_top] lg:opacity-75 lg:[mask-image:linear-gradient(90deg,transparent_22%,#000_62%)]'
            }
          />
        </picture>
        <Sparkle size={20} className={'top-[150px] left-[52%]'} />
        <Sparkle size={14} opacity={0.8} className={'top-[44%] left-[90%]'} />

        <div
          className={`${WRAP} relative flex flex-col gap-3.5 pt-[83px] pb-[190px] lg:gap-[22px] lg:min-h-[664px] lg:justify-end lg:pt-[144px] lg:pb-20`}
        >
          <h1
            id={'home-h1'}
            className={
              'm-0 max-w-[560px] text-[19px] lg:text-[28px] leading-[1.2] font-extrabold uppercase text-accent'
            }
          >
            {seoTitle}
          </h1>
          <p
            className={
              'm-0 text-[62px] tracking-[-1.5px] lg:text-[clamp(64px,9.6vw,138px)] lg:tracking-[-3px] leading-[0.9] font-extrabold uppercase text-accent'
            }
          >
            {first}
            {rest.length > 0 && (
              <>
                <br />
                {rest.join(' ')}
              </>
            )}
          </p>
          {!!lead && (
            <p
              className={
                'm-0 max-w-[520px] text-[15px] lg:text-[19px] leading-[1.5] font-medium text-accent'
              }
            >
              {lead}
            </p>
          )}
          <div className={'flex flex-wrap gap-4'}>
            <BbLink href={linkToReserve} className={'w-full lg:w-auto'} id={'book-button'}>
              {'Rezervovat termín'}
            </BbLink>
            <BbLink href={'/cenik'} tone={'outline'} className={'hidden lg:inline-flex'}>
              {'Ceník'}
            </BbLink>
          </div>
        </div>
      </div>

      <div className={'bg-accent'}>
        <dl className={`${WRAP} m-0 grid grid-cols-2 gap-x-6 py-2 lg:py-0 lg:grid-cols-4`}>
          <Fact label={'Adresa'}>{facts.address}</Fact>
          <Fact label={'Otevřeno'}>{facts.openHours}</Fact>
          <Fact label={'Telefon'}>
            <a
              href={`tel:${facts.phone.replaceAll(' ', '')}`}
              className={'text-white hover:text-[#ff9dbb]'}
            >
              {facts.phone}
            </a>
          </Fact>
          <Fact label={'Rezervace'}>
            <Link href={linkToReserve} className={'text-white hover:text-[#ff9dbb]'}>
              {'Online, kdykoli'}
            </Link>
          </Fact>
        </dl>
      </div>
    </section>
  )
}
