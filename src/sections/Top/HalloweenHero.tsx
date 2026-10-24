import Button from 'components/Button'
import { Container } from 'components/Container'
import Image from 'components/Image'
import { HALLOWEEN, halloweenDates } from 'lib/halloween'
import { Anton } from 'next/font/google'
import Link from 'next/link'

import HalloweenBackdrop from './HalloweenBackdrop'

// Anton jen pro nadpis heroe. `latin-ext` kvůli případné diakritice v titulku.
const anton = Anton({
  subsets: ['latin', 'latin-ext'],
  weight: '400',
  display: 'swap',
  fallback: ['Montserrat', 'Arial', 'sans-serif'],
})

// „Become an icon“ → řádek 1 „Become“, řádek 2 „an“ + bílé blikající „icon“.
const splitTitle = (title: string) => {
  const words = title.trim().split(/\s+/)
  if (words.length < 2) return { first: '', middle: '', neon: words[0] ?? '' }
  if (words.length === 2) return { first: words[0], middle: '', neon: words[1] }
  return { first: words[0], middle: words.slice(1, -1).join(' '), neon: words[words.length - 1] }
}

// Jeden pruh = fráze z konfigurace (na desktopu dvakrát, aby byl pruh širší
// než obrazovka). Dva stejné pruhy + posun o -50 % = nekonečná smyčka.
const Strip = () => (
  <div className={'flex shrink-0'} aria-hidden>
    {[0, 1].map((round) =>
      HALLOWEEN.marquee.map((phrase) => (
        <span
          key={`${round}-${phrase}`}
          className={`shrink-0 px-5 lg:px-7 ${round ? 'hidden lg:block' : ''}`}
        >
          {phrase}
        </span>
      )),
    )}
  </div>
)

// Sezónní hero (lib/halloween.ts) místo `Top` na hlavní stránce: tmavá
// „laboratoř“ s fotkou lebky, výstražnou páskou nahoře a běžící lištou dole.
export const HalloweenHero = ({
  title,
  linkToReserve,
}: {
  title: string
  linkToReserve: string
}) => {
  const { first, middle, neon } = splitTitle(title || HALLOWEEN.title)
  const dates = halloweenDates()

  return (
    <section
      aria-labelledby={'top-title'}
      className={
        'h-screen md:min-h-[800px] relative z-10 mb-13.5 overflow-hidden bg-accent text-white'
      }
    >
      <HalloweenBackdrop />

      {/* Páska nad hlavičkou — hlavička se na této stránce posouvá o její výšku. */}
      <div
        className={'absolute top-0 left-0 w-full h-2.5 lg:h-[14px] bg-hazard-sm lg:bg-hazard'}
        aria-hidden
      />

      <Image
        src={'/assets/halloween/sticker-dekorace.jpg'}
        alt={'Dekorace — neotvírat, nereanimovat'}
        width={1280}
        height={511}
        sizes={'(min-width: 1024px) 360px, 190px'}
        className={
          'absolute z-[6] right-[-14px] top-[112px] w-[190px] h-auto lg:right-[90px] lg:top-[120px] lg:w-[360px] origin-[12%_50%] rotate-[7deg] motion-safe:animate-swing shadow-[0_20px_40px_rgba(0,0,0,.6)] lg:shadow-[0_30px_50px_rgba(0,0,0,.6)]'
        }
      />

      <div
        className={
          'hidden lg:block absolute z-10 right-[90px] top-[300px] text-right text-resXs leading-5 tracking-[.16em] uppercase text-white/75'
        }
      >
        <p>
          {'Status: '}
          <span className={'text-primary'}>{HALLOWEEN.status}</span>
        </p>
        <p>{HALLOWEEN.statusNote}</p>
      </div>

      <div className={'absolute inset-x-0 bottom-9 lg:bottom-10 z-10'}>
        <Container size={'xl'} className={'pb-10 lg:pb-15'}>
          <div className={'lg:max-w-[840px]'}>
            <p
              className={
                'inline-flex items-center gap-2.5 lg:gap-3 border-2 border-primary px-2.5 py-1.5 lg:px-[14px] lg:py-[7px] mb-4 lg:mb-5.5 text-resXxs lg:text-resXs tracking-[.16em] uppercase'
              }
            >
              <span
                className={
                  'block w-[7px] h-[7px] lg:w-2 lg:h-2 bg-primary motion-safe:animate-bulb'
                }
                aria-hidden
              />
              <span>
                {`${HALLOWEEN.badge} · `}
                <span className={'hidden lg:inline'}>{'Halloween '}</span>
                {dates}
              </span>
            </p>

            <h1
              id={'top-title'}
              className={`${anton.className} font-normal text-[84px] md:text-[128px] lg:text-[172px] leading-[.9] tracking-[-.005em] uppercase text-primary mb-2.5`}
            >
              {/* Mezera před <br>, aby text nadpisu (SEO, čtečky) nebyl „Becomean icon“. */}
              {first && `${first} `}
              {first && <br />}
              {middle && `${middle} `}
              <span
                className={
                  'text-white motion-safe:animate-neon motion-reduce:[text-shadow:0_0_18px_rgba(255,255,255,.55)]'
                }
              >
                {neon}
              </span>
            </h1>

            <p
              className={
                'mb-5 lg:mb-7 text-[14px] leading-[22px] lg:text-[20px] lg:leading-[30px] font-bold uppercase tracking-[.06em]'
              }
            >
              {HALLOWEEN.subtitle}
              <br />
              <span className={'text-primary'}>{HALLOWEEN.subtitleAccent}</span>
            </p>

            <div className={'flex flex-wrap items-center gap-2.5 lg:gap-4'}>
              <Button inverse text={'Rezervovat termín'} id={'book-button'} href={linkToReserve} />
              <Button
                outline
                className={'lg:hidden'}
                text={HALLOWEEN.secondary.labelMobile}
                href={HALLOWEEN.secondary.href}
              />
              <Button
                outline
                className={'hidden lg:inline-block'}
                text={HALLOWEEN.secondary.label}
                href={HALLOWEEN.secondary.href}
              />
            </div>
          </div>
        </Container>
      </div>

      <Link
        href={linkToReserve}
        aria-label={`${HALLOWEEN.marquee.join(' · ')} — Rezervovat termín`}
        className={
          'group absolute bottom-0 left-0 z-[12] w-full h-9 lg:h-10 flex items-center overflow-hidden bg-primary text-accent uppercase text-resXs lg:text-resSm tracking-[.05em]'
        }
      >
        <div
          className={
            'flex whitespace-nowrap will-change-transform motion-safe:animate-marquee-halloween-sm lg:motion-safe:animate-marquee-halloween group-hover:[animation-play-state:paused]'
          }
        >
          <Strip />
          <Strip />
        </div>
      </Link>
    </section>
  )
}
