'use client'
import type { GalleryChip, GalleryPhoto } from './types'

import Button from 'components/Button'
import Image from 'components/Image'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import dynamic from 'next/dynamic'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { pad2 } from './types'

// Prohlížeč se stahuje až po prvním kliknutí na fotku.
const GalleryViewer = dynamic(() => import('./GalleryViewer'), { ssr: false })

interface GalleryStripProps {
  photos: GalleryPhoto[]
  chips: GalleryChip[]
  instagram?: { url: string; handle: string }
  linkToReserve: string
}

// Levý okraj první karty = okraj obsahu stránky (max 1440 px); `%` v paddingu
// i ve scroll-paddingu se počítá z šířky sekce, takže to sedí i na širokém monitoru.
const STRIP_PAD =
  'pl-[max(20px,calc((100%_-_1440px)/2_+_20px))] scroll-pl-[max(20px,calc((100%_-_1440px)/2_+_20px))] ' +
  'lg:pl-[max(72px,calc((100%_-_1440px)/2_+_72px))] lg:scroll-pl-[max(72px,calc((100%_-_1440px)/2_+_72px))]'

const WRAP = 'mx-auto w-full max-w-[1440px] px-5 lg:px-[72px]'

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

interface StripView {
  first: number
  last: number
  atStart: boolean
  atEnd: boolean
  canScroll: boolean
}

const INITIAL_VIEW: StripView = { first: 0, last: 0, atStart: true, atEnd: false, canScroll: true }

const InstagramIcon = () => (
  <svg
    aria-hidden={'true'}
    width={'18'}
    height={'18'}
    viewBox={'0 0 24 24'}
    fill={'none'}
    stroke={'currentColor'}
    strokeWidth={'2.2'}
    strokeLinecap={'round'}
    strokeLinejoin={'round'}
  >
    <rect x={'3'} y={'3'} width={'18'} height={'18'} rx={'5'} />
    <circle cx={'12'} cy={'12'} r={'4'} />
    <circle cx={'17.5'} cy={'6.5'} r={'1'} fill={'currentColor'} stroke={'none'} />
  </svg>
)

const GalleryStrip = ({ photos, chips, instagram, linkToReserve }: GalleryStripProps) => {
  // První render (server i klient) = „Vše“ a první karta — bez rozdílu při hydrataci.
  const [filter, setFilter] = useState<string | null>(null)
  const [open, setOpen] = useState<number | null>(null)
  const [view, setView] = useState<StripView>(INITIAL_VIEW)
  const scrollerRef = useRef<HTMLUListElement>(null)
  const cardRefs = useRef<(HTMLButtonElement | null)[]>([])
  const frame = useRef(0)

  const visible = useMemo(
    () => (filter ? photos.filter((p) => p.service?.slug === filter) : photos),
    [filter, photos],
  )
  const total = visible.length

  const measure = useCallback(() => {
    const el = scrollerRef.current
    if (!el) return
    const box = el.getBoundingClientRect()
    let first = -1
    let last = -1
    for (let i = 0; i < total; i++) {
      const card = cardRefs.current[i]
      if (!card) continue
      const r = card.getBoundingClientRect()
      if (r.left >= box.left - 2 && r.right <= box.right + 2) {
        if (first < 0) first = i
        last = i
      }
    }
    const max = el.scrollWidth - el.clientWidth
    if (first < 0) {
      // Úzké okno, žádná karta celá — vezmi tu nejblíž začátku.
      const step = max > 0 ? el.scrollLeft / max : 0
      first = Math.round(step * (total - 1))
      last = first
    }
    setView({
      first,
      last,
      atStart: el.scrollLeft <= 2,
      atEnd: el.scrollLeft >= max - 2,
      canScroll: max > 2,
    })
  }, [total])

  const onScroll = () => {
    cancelAnimationFrame(frame.current)
    frame.current = requestAnimationFrame(measure)
  }

  // Nový filtr → lenta od začátku, počítadlo znovu.
  useEffect(() => {
    scrollerRef.current?.scrollTo({ left: 0 })
    measure()
  }, [visible, measure])

  useEffect(() => {
    const el = scrollerRef.current
    if (!el) return
    const ro = new ResizeObserver(() => measure())
    ro.observe(el)
    return () => {
      ro.disconnect()
      cancelAnimationFrame(frame.current)
    }
  }, [measure])

  const scrollByCard = (dir: 1 | -1) => {
    const el = scrollerRef.current
    const card = cardRefs.current[0]
    if (!el || !card) return
    const gap = Number.parseFloat(getComputedStyle(el).columnGap) || 0
    el.scrollBy({
      left: dir * (card.offsetWidth + gap),
      behavior: prefersReducedMotion() ? 'auto' : 'smooth',
    })
  }

  const closeViewer = (index: number) => {
    setOpen(null)
    const card = cardRefs.current[index]
    if (card) {
      card.focus({ preventScroll: true })
      card.scrollIntoView({ block: 'nearest', inline: 'nearest' })
    }
  }

  const progress = total > 0 ? ((view.last + 1) / total) * 100 : 0
  const chipCls = (active: boolean) =>
    `shrink-0 h-11 px-[18px] lg:px-[22px] border-2 border-accent text-resXs lg:text-xss tracking-[.06em] uppercase transition-colors duration-200 ${
      active ? 'bg-accent text-white' : 'bg-transparent text-accent hover:bg-accent/10'
    }`

  return (
    <>
      <div
        className={`${WRAP} flex flex-col gap-6 lg:flex-row lg:flex-wrap lg:items-end lg:justify-between lg:gap-x-10`}
      >
        <div className={'flex flex-col gap-2 lg:gap-2.5'}>
          <p className={'text-resXs lg:text-xss tracking-[.14em] uppercase text-primary'}>
            {'Portfolio · čerstvé z křesla'}
          </p>
          <h2
            id={'nase-prace'}
            className={
              'text-[56px] leading-[56px] font-extrabold lg:text-big uppercase tracking-[-.01em]'
            }
          >
            {'Naše práce'}
          </h2>
        </div>

        {chips.length > 0 && (
          <div
            role={'group'}
            aria-label={'Filtrovat fotky podle služby'}
            className={
              '-mr-5 flex gap-2 overflow-x-auto pr-5 lg:mr-0 lg:pr-0 lg:pb-2.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'
            }
          >
            <button
              type={'button'}
              aria-pressed={filter === null}
              className={chipCls(filter === null)}
              onClick={() => setFilter(null)}
            >
              {'Vše'}
            </button>
            {chips.map((chip) => (
              <button
                key={chip.slug}
                type={'button'}
                aria-pressed={filter === chip.slug}
                className={chipCls(filter === chip.slug)}
                onClick={() => setFilter(chip.slug)}
              >
                {chip.label}
              </button>
            ))}
          </div>
        )}
      </div>

      <ul
        ref={scrollerRef}
        onScroll={onScroll}
        className={`mt-6 lg:mt-12 flex items-start gap-3 lg:gap-4 overflow-x-auto snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden after:shrink-0 after:w-2 after:content-[''] lg:after:w-14 ${STRIP_PAD}`}
      >
        {visible.map((photo, i) => (
          <li key={photo.key} className={`shrink-0 snap-start ${i % 2 === 1 ? 'lg:mt-10' : ''}`}>
            <button
              ref={(el) => {
                cardRefs.current[i] = el
              }}
              type={'button'}
              onClick={() => setOpen(i)}
              aria-label={[`Otevřít fotku ${i + 1} z ${total}`, photo.service?.title]
                .filter(Boolean)
                .join(' — ')}
              className={
                'group relative block w-[272px] lg:w-[304px] aspect-[3/4] overflow-hidden bg-accent text-left focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-[-3px] focus-visible:outline-primary'
              }
            >
              <Image
                src={photo.url}
                alt={photo.alt}
                fill
                sizes={'(max-width: 1023px) 272px, 304px'}
                loading={'lazy'}
                className={
                  'object-cover motion-safe:transition-transform motion-safe:duration-500 motion-safe:group-hover:scale-[1.03]'
                }
              />
              <span
                aria-hidden={'true'}
                className={
                  'absolute top-3 left-3.5 lg:top-3.5 lg:left-4 text-xss text-white [text-shadow:0_1px_6px_rgba(0,0,0,.5)]'
                }
              >
                {pad2(i + 1)}
              </span>
              <span
                aria-hidden={'true'}
                className={`absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-b from-accent/0 to-accent/[.82] px-3.5 pb-3.5 pt-16 lg:px-4 lg:pb-4 lg:pt-[72px] transition-opacity duration-300 [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:opacity-100 [@media(hover:hover)]:group-focus-visible:opacity-100 ${
                  photo.service ? '' : '[@media(hover:none)]:hidden'
                }`}
              >
                {photo.service ? (
                  <span
                    className={
                      'inline-block h-7 leading-7 px-3 bg-white text-accent text-[11px] font-extrabold tracking-[.08em] uppercase'
                    }
                  >
                    {photo.service.title}
                  </span>
                ) : (
                  <span />
                )}
                <span
                  className={
                    'text-resXs tracking-[.06em] uppercase text-white [@media(hover:none)]:hidden'
                  }
                >
                  {'Zobrazit →'}
                </span>
              </span>
            </button>
          </li>
        ))}
      </ul>

      <div
        className={`${WRAP} mt-6 flex flex-col gap-5 lg:mt-12 lg:flex-row lg:items-center lg:justify-between`}
      >
        <div className={'flex items-center gap-4 lg:gap-5'}>
          <span
            className={
              'whitespace-nowrap text-xss lg:text-[14px] lg:leading-5 font-extrabold tracking-[.08em] tabular-nums'
            }
          >
            {`${pad2(view.first + 1)} — ${pad2(total)}`}
          </span>
          <span
            aria-hidden={'true'}
            className={
              'relative h-[3px] flex-1 bg-accent/[.18] lg:w-[200px] lg:flex-none xl:w-[320px]'
            }
          >
            <span
              className={
                'absolute inset-y-0 left-0 bg-primary motion-safe:transition-[width] motion-safe:duration-300'
              }
              style={{ width: `${progress}%` }}
            />
          </span>
          {view.canScroll && (
            <span
              aria-hidden={'true'}
              className={
                'lg:hidden whitespace-nowrap text-[12px] leading-4 font-medium text-[#5d5d5a]'
              }
            >
              {'Posuňte prstem →'}
            </span>
          )}
        </div>

        <div className={'flex flex-col gap-5 lg:flex-row lg:items-center lg:gap-6 xl:gap-8'}>
          {instagram && (
            <a
              href={instagram.url}
              target={'_blank'}
              rel={'noopener noreferrer'}
              className={
                'order-2 inline-flex items-center gap-2.5 self-center text-xss tracking-[.06em] uppercase text-accent hover:text-primary lg:order-1 lg:self-auto'
              }
            >
              <InstagramIcon />
              <span
                className={'border-b-2 border-current pb-0.5'}
              >{`Více na ${instagram.handle}`}</span>
            </a>
          )}
          {view.canScroll && (
            <div className={'hidden gap-2 lg:order-2 lg:flex'}>
              <button
                type={'button'}
                aria-label={'Předchozí fotky'}
                disabled={view.atStart}
                onClick={() => scrollByCard(-1)}
                className={
                  'inline-flex h-14 w-14 items-center justify-center border-2 border-accent text-accent transition-colors duration-200 enabled:hover:bg-accent enabled:hover:text-white disabled:opacity-30'
                }
              >
                <ChevronLeft size={22} strokeWidth={2.5} aria-hidden={'true'} />
              </button>
              <button
                type={'button'}
                aria-label={'Další fotky'}
                disabled={view.atEnd}
                onClick={() => scrollByCard(1)}
                className={
                  'inline-flex h-14 w-14 items-center justify-center border-2 border-accent bg-accent text-white transition-colors duration-200 enabled:hover:border-primary enabled:hover:bg-primary disabled:opacity-30'
                }
              >
                <ChevronRight size={22} strokeWidth={2.5} aria-hidden={'true'} />
              </button>
            </div>
          )}
          <Button
            text={'Rezervovat termín'}
            href={linkToReserve}
            inverse
            className={'order-1 w-full lg:order-3 lg:w-auto'}
          />
        </div>
      </div>

      {open !== null && visible[open] && (
        <GalleryViewer
          photos={visible}
          index={open}
          onIndex={setOpen}
          onClose={() => closeViewer(open)}
          linkToReserve={linkToReserve}
        />
      )}
    </>
  )
}

export default GalleryStrip
