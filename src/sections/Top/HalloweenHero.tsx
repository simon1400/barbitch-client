import Button from 'components/Button'
import { Container } from 'components/Container'
import { HALLOWEEN, halloweenDates, halloweenDayWord, halloweenText } from 'lib/halloween'
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
const Strip = ({ phrases }: { phrases: string[] }) => (
  <div className={'flex shrink-0'} aria-hidden>
    {[0, 1].map((round) =>
      phrases.map((phrase) => (
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
  const dayWord = halloweenDayWord()
  const t = (text: string) => halloweenText(text, dayWord)
  const marquee = HALLOWEEN.marquee.map(t)
  const secondaryHref = HALLOWEEN.secondary.href

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

      {/* Visačka + status: jeden odkaz na rezervaci. Tvar z clip-path, proto
          stín přes drop-shadow na obalu (box-shadow by se ořízl). */}
      <Link
        href={linkToReserve}
        aria-label={`${t(HALLOWEEN.tag.big)} — ${t(HALLOWEEN.tag.line)}. Rezervovat termín`}
        className={
          'group absolute z-[6] right-[-6px] top-[112px] w-[200px] lg:right-[90px] lg:top-[120px] lg:w-[360px] block'
        }
      >
        <span
          className={
            'block origin-[12%_50%] rotate-[7deg] motion-safe:animate-swing [filter:drop-shadow(0_20px_30px_rgba(0,0,0,.6))] lg:[filter:drop-shadow(0_30px_40px_rgba(0,0,0,.6))] transition-transform duration-300 group-hover:scale-[1.04] group-focus-visible:scale-[1.04]'
          }
        >
          <span
            className={
              'relative flex items-center bg-primary text-accent [clip-path:polygon(7%_0,93%_0,100%_22%,100%_78%,93%_100%,7%_100%,0_78%,0_22%)] py-3 lg:py-5'
            }
          >
            {/* Výstražné pruhy na obou koncích a očko visačky vlevo. */}
            <span
              className={
                'absolute inset-y-0 left-0 w-[9%] bg-[repeating-linear-gradient(135deg,#161615_0_6px,#f5c400_6px_12px)] lg:bg-[repeating-linear-gradient(135deg,#161615_0_10px,#f5c400_10px_20px)]'
              }
              aria-hidden
            />
            <span
              className={
                'absolute inset-y-0 right-0 w-[9%] bg-[repeating-linear-gradient(135deg,#161615_0_6px,#f5c400_6px_12px)] lg:bg-[repeating-linear-gradient(135deg,#161615_0_10px,#f5c400_10px_20px)]'
              }
              aria-hidden
            />
            <span
              className={
                'absolute left-[3.5%] top-1/2 -translate-y-1/2 w-[9px] h-[9px] lg:w-4 lg:h-4 rounded-full bg-accent shadow-[inset_0_0_0_2px_#3a3a3a]'
              }
              aria-hidden
            />
            <span className={'relative w-full text-center px-[13%] uppercase leading-none'}>
              <span
                className={`${anton.className} block text-[34px] lg:text-[60px] leading-[.95] tracking-[-.01em]`}
              >
                {t(HALLOWEEN.tag.big)}
              </span>
              <span
                className={
                  'block mt-1 lg:mt-2 text-[11px] lg:text-[21px] font-extrabold tracking-[.02em]'
                }
              >
                {t(HALLOWEEN.tag.line)}
              </span>
              <span
                className={
                  'block mt-1 lg:mt-2 text-[7px] lg:text-[12px] font-bold tracking-[.28em] text-accent/80 group-hover:text-accent'
                }
              >
                {t(HALLOWEEN.tag.small)}
              </span>
            </span>
          </span>
        </span>

        <span
          className={
            'hidden lg:block absolute right-0 top-[180px] w-[420px] text-right text-resXs leading-5 tracking-[.16em] uppercase text-white/75 transition-colors group-hover:text-white'
          }
        >
          <span className={'block'}>
            {'Status: '}
            <span className={'text-primary'}>{t(HALLOWEEN.status)}</span>
          </span>
          <span className={'block'}>{t(HALLOWEEN.statusNote)}</span>
        </span>
      </Link>

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
              <span className={'text-primary'}>{t(HALLOWEEN.subtitleAccent)}</span>
            </p>

            <div className={'flex flex-wrap items-center gap-2.5 lg:gap-4'}>
              <Button inverse text={'Rezervovat termín'} id={'book-button'} href={linkToReserve} />
              <Button
                outline
                className={'lg:hidden'}
                text={t(HALLOWEEN.secondary.labelMobile)}
                href={secondaryHref}
              />
              <Button
                outline
                className={'hidden lg:inline-block'}
                text={t(HALLOWEEN.secondary.label)}
                href={secondaryHref}
              />
            </div>
          </div>
        </Container>
      </div>

      <Link
        href={linkToReserve}
        aria-label={`${marquee.join(' · ')} — Rezervovat termín`}
        className={
          'group absolute bottom-0 left-0 z-[12] w-full h-9 lg:h-10 flex items-center overflow-hidden bg-primary text-accent uppercase text-resXs lg:text-resSm tracking-[.05em]'
        }
      >
        <div
          className={
            'flex whitespace-nowrap will-change-transform motion-safe:animate-marquee-halloween-sm lg:motion-safe:animate-marquee-halloween group-hover:[animation-play-state:paused]'
          }
        >
          <Strip phrases={marquee} />
          <Strip phrases={marquee} />
        </div>
      </Link>
    </section>
  )
}
