'use client'
import { HIRING } from 'lib/hiring'
import Link from 'next/link'

// Jedna jednotka běžícího textu (text + výzva + šipka jako v blogu).
const Phrase = () => (
  <span className={'flex items-center gap-4 shrink-0 px-6'}>
    <span>{HIRING.marquee}</span>
    <span className={'text-primary flex items-center gap-3'}>
      {HIRING.cta}
      <span className={'text-base lg:text-md leading-none relative -top-[3px]'}>{'→'}</span>
    </span>
  </span>
)

// Jeden pruh = několik frází vedle sebe. Dva stejné pruhy + posun o -50 %
// dávají nekonečnou bezešvou smyčku.
const SLOTS = ['a', 'b', 'c', 'd', 'e', 'f']

const Strip = () => (
  <div className={'flex shrink-0'} aria-hidden>
    {SLOTS.map((slot) => (
      <Phrase key={slot} />
    ))}
  </div>
)

const HiringBar = () => {
  if (!HIRING.enabled) return null

  return (
    <>
      <Link
        href={HIRING.href}
        aria-label={`${HIRING.marquee} — ${HIRING.cta}`}
        className={
          'fixed top-0 left-0 w-full z-[60] h-9 lg:h-10 bg-accent text-white flex items-center overflow-hidden uppercase text-xs lg:text-sm tracking-wide group'
        }
      >
        <div
          className={
            'flex whitespace-nowrap will-change-transform animate-marquee group-hover:[animation-play-state:paused]'
          }
        >
          <Strip />
          <Strip />
        </div>
      </Link>
      {/* Спейсер под фикс-полосу (раньше был pt-9 на body) — исчезает вместе
          с полосой, когда HiringBar скрыт (напр. в кабинете). */}
      <div className={'h-9 lg:h-10'} aria-hidden />
    </>
  )
}

export default HiringBar
