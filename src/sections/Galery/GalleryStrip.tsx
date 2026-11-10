'use client'
import type { GalleryChip, GalleryPhoto } from './types'

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

// Automatické posouvání: krok každé 4 s; po zásahu uživatele (prst, myš,
// kolečko, čip, šipka) pauza 8 s; stojí při najetí myší, fokusu uvnitř,
// otevřeném prohlížeči, mimo obrazovku a při `prefers-reduced-motion`.
const AUTOPLAY_MS = 4000
const IDLE_AFTER_USER_MS = 8000

interface StripView {
  atStart: boolean
  atEnd: boolean
  canScroll: boolean
}

const INITIAL_VIEW: StripView = { atStart: true, atEnd: false, canScroll: true }

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
  const openRef = useRef(open)
  openRef.current = open
  const pausedUntil = useRef(0)
  const hovering = useRef(false)
  const drag = useRef<{ x: number; left: number; moved: boolean; id: number } | null>(null)
  const suppressClick = useRef(false)
  const [dragging, setDragging] = useState(false)

  const pauseAutoplay = () => {
    pausedUntil.current = Date.now() + IDLE_AFTER_USER_MS
  }

  const visible = useMemo(
    () => (filter ? photos.filter((p) => p.service?.slug === filter) : photos),
    [filter, photos],
  )
  const total = visible.length

  const measure = useCallback(() => {
    const el = scrollerRef.current
    if (!el) return
    const max = el.scrollWidth - el.clientWidth
    setView({
      atStart: el.scrollLeft <= 2,
      atEnd: el.scrollLeft >= max - 2,
      canScroll: max > 2,
    })
  }, [])

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

  const scrollByCard = useCallback((dir: 1 | -1) => {
    const el = scrollerRef.current
    const card = cardRefs.current[0]
    if (!el || !card) return
    const gap = Number.parseFloat(getComputedStyle(el).columnGap) || 0
    el.scrollBy({
      left: dir * (card.offsetWidth + gap),
      behavior: prefersReducedMotion() ? 'auto' : 'smooth',
    })
  }, [])

  // Automatické posouvání lenty.
  useEffect(() => {
    const el = scrollerRef.current
    if (!el || prefersReducedMotion()) return
    let inView = false
    const io = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting
      },
      { threshold: 0.5 },
    )
    io.observe(el)
    const timer = setInterval(() => {
      if (!inView || hovering.current || drag.current || document.hidden) return
      if (openRef.current !== null || Date.now() < pausedUntil.current) return
      if (el.contains(document.activeElement)) return
      const max = el.scrollWidth - el.clientWidth
      if (max <= 2) return
      if (el.scrollLeft >= max - 2) el.scrollTo({ left: 0, behavior: 'smooth' })
      else scrollByCard(1)
    }, AUTOPLAY_MS)
    return () => {
      io.disconnect()
      clearInterval(timer)
    }
  }, [scrollByCard])

  // Táhnutí myší (desktop). Na dotyku se lenta posouvá nativně.
  const onPointerDown = (e: React.PointerEvent<HTMLUListElement>) => {
    pauseAutoplay()
    const el = scrollerRef.current
    if (!el || e.pointerType !== 'mouse' || e.button !== 0) return
    drag.current = { x: e.clientX, left: el.scrollLeft, moved: false, id: e.pointerId }
  }

  const onPointerMove = (e: React.PointerEvent<HTMLUListElement>) => {
    const d = drag.current
    const el = scrollerRef.current
    if (!d || !el) return
    const dx = e.clientX - d.x
    if (!d.moved) {
      if (Math.abs(dx) < 6) return
      d.moved = true
      setDragging(true)
      el.setPointerCapture(d.id)
    }
    el.scrollLeft = d.left - dx
  }

  const endDrag = () => {
    const d = drag.current
    drag.current = null
    const el = scrollerRef.current
    if (!d?.moved || !el) return
    // Klik, který následuje hned po puštění, nesmí otevřít fotku.
    suppressClick.current = true
    setTimeout(() => {
      suppressClick.current = false
    }, 0)
    if (el.hasPointerCapture(d.id)) el.releasePointerCapture(d.id)
    // Dorovnat na nejbližší kartu, pak teprve vrátit scroll-snap (jinak by skočil).
    const padLeft = Number.parseFloat(getComputedStyle(el).paddingLeft) || 0
    const edge = el.getBoundingClientRect().left + padLeft
    let delta = 0
    let best = Number.POSITIVE_INFINITY
    cardRefs.current.slice(0, total).forEach((card) => {
      if (!card) return
      const diff = card.getBoundingClientRect().left - edge
      if (Math.abs(diff) < best) {
        best = Math.abs(diff)
        delta = diff
      }
    })
    el.scrollBy({ left: delta, behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
    setTimeout(() => setDragging(false), 450)
  }

  const closeViewer = (index: number) => {
    setOpen(null)
    const card = cardRefs.current[index]
    if (card) {
      card.focus({ preventScroll: true })
      card.scrollIntoView({ block: 'nearest', inline: 'nearest' })
    }
  }

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
              onClick={() => {
                pauseAutoplay()
                setFilter(null)
              }}
            >
              {'Vše'}
            </button>
            {chips.map((chip) => (
              <button
                key={chip.slug}
                type={'button'}
                aria-pressed={filter === chip.slug}
                className={chipCls(filter === chip.slug)}
                onClick={() => {
                  pauseAutoplay()
                  setFilter(chip.slug)
                }}
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
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onWheel={pauseAutoplay}
        onMouseEnter={() => {
          hovering.current = true
        }}
        onMouseLeave={() => {
          hovering.current = false
        }}
        onDragStart={(e) => e.preventDefault()}
        onClickCapture={(e) => {
          if (suppressClick.current) {
            e.preventDefault()
            e.stopPropagation()
          }
        }}
        className={`mt-6 lg:mt-12 flex items-start gap-3 lg:gap-4 overflow-x-auto ${
          dragging
            ? 'snap-none cursor-grabbing select-none'
            : 'snap-x snap-mandatory lg:cursor-grab'
        } [scrollbar-width:none] [&::-webkit-scrollbar]:hidden after:shrink-0 after:w-2 after:content-[''] lg:after:w-14 ${STRIP_PAD}`}
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
                draggable={false}
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

      <div className={`${WRAP} mt-6 flex items-center justify-between gap-5 lg:mt-12`}>
        {instagram ? (
          <a
            href={instagram.url}
            target={'_blank'}
            rel={'noopener noreferrer'}
            className={
              'inline-flex items-center gap-2.5 whitespace-nowrap text-xss tracking-[.06em] uppercase text-accent hover:text-primary'
            }
          >
            <InstagramIcon />
            <span
              className={'border-b-2 border-current pb-0.5'}
            >{`Více na ${instagram.handle}`}</span>
          </a>
        ) : (
          <span />
        )}

        <div className={'flex items-center'}>
          {view.canScroll && (
            <div className={'hidden gap-2 lg:flex'}>
              <button
                type={'button'}
                aria-label={'Předchozí fotky'}
                disabled={view.atStart}
                onClick={() => {
                  pauseAutoplay()
                  scrollByCard(-1)
                }}
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
                onClick={() => {
                  pauseAutoplay()
                  scrollByCard(1)
                }}
                className={
                  'inline-flex h-14 w-14 items-center justify-center border-2 border-accent bg-accent text-white transition-colors duration-200 enabled:hover:border-primary enabled:hover:bg-primary disabled:opacity-30'
                }
              >
                <ChevronRight size={22} strokeWidth={2.5} aria-hidden={'true'} />
              </button>
            </div>
          )}
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
