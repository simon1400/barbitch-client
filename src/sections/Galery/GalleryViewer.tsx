'use client'
import type { GalleryPhoto } from './types'

import Image from 'components/Image'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useLayoutEffect, useRef } from 'react'

import { pad2, pricelistLabel, reserveLabel } from './types'

interface GalleryViewerProps {
  photos: GalleryPhoto[]
  index: number
  onIndex: (index: number) => void
  onClose: () => void
  linkToReserve: string
}

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * Prohlížeč fotek galerie „Naše práce“: celoobrazovkový `<dialog>` v barvách
 * rezervace. Listování = vodorovný `scroll-snap` (prst, touchpad), šipky,
 * miniatury a klávesy ←/→; Esc zavírá (nativně).
 */
const GalleryViewer = ({ photos, index, onIndex, onClose, linkToReserve }: GalleryViewerProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const settle = useRef<ReturnType<typeof setTimeout>>(undefined)
  const firstScroll = useRef(true)
  const indexRef = useRef(index)
  indexRef.current = index

  const total = photos.length
  const photo = photos[index]
  const slug = photo.service?.slug

  const go = (i: number) => onIndex(Math.min(total - 1, Math.max(0, i)))

  // Otevřít modálně, zamknout stránku pod ním.
  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (!dialog.open) dialog.showModal()
    const html = document.documentElement
    const prevOverflow = html.style.overflow
    html.style.overflow = 'hidden'
    return () => {
      html.style.overflow = prevOverflow
      clearTimeout(settle.current)
    }
  }, [])

  // Index → poloha pásu (šipky, miniatury, klávesy). Po swipu už sedí, nic se neděje.
  useLayoutEffect(() => {
    const track = trackRef.current
    if (!track || track.clientWidth === 0) return
    const current = Math.round(track.scrollLeft / track.clientWidth)
    if (current !== index) {
      track.scrollTo({
        left: index * track.clientWidth,
        behavior: firstScroll.current || reducedMotion() ? 'auto' : 'smooth',
      })
    }
    firstScroll.current = false
  }, [index])

  // Změna velikosti okna — srovnat pás na aktuální fotku.
  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    const ro = new ResizeObserver(() => {
      track.scrollTo({ left: indexRef.current * track.clientWidth })
    })
    ro.observe(track)
    return () => ro.disconnect()
  }, [])

  // Swipe: index se převezme až po doběhnutí snapu (i u plynulého scrollTo).
  const onTrackScroll = () => {
    clearTimeout(settle.current)
    settle.current = setTimeout(() => {
      const track = trackRef.current
      if (!track || track.clientWidth === 0) return
      const i = Math.min(total - 1, Math.max(0, Math.round(track.scrollLeft / track.clientWidth)))
      if (i !== indexRef.current) onIndex(i)
    }, 90)
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLDialogElement>) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault()
      go(index - 1)
    } else if (e.key === 'ArrowRight') {
      e.preventDefault()
      go(index + 1)
    }
  }

  const counter = `${pad2(index + 1)} / ${pad2(total)}`
  const arrowBase =
    'hidden lg:inline-flex h-14 w-14 shrink-0 items-center justify-center border-2 transition-colors duration-200 disabled:opacity-30'

  return (
    <dialog
      ref={dialogRef}
      aria-label={'Naše práce — prohlížeč fotek'}
      onClose={onClose}
      onKeyDown={onKeyDown}
      className={
        'fixed inset-0 m-0 h-full max-h-none w-full max-w-none overflow-hidden bg-accent p-0 text-white backdrop:bg-accent'
      }
    >
      <div className={'relative flex h-full flex-col'}>
        {/* Horní lišta: na mobilu přes fotku s přechodem, na desktopu samostatně. */}
        <div
          className={
            'absolute inset-x-0 top-0 z-10 flex h-[88px] items-start justify-between bg-gradient-to-b from-accent/60 to-accent/0 pl-5 pr-4 pt-4 lg:static lg:h-[76px] lg:items-center lg:bg-none lg:px-10 lg:pt-7'
          }
        >
          <p className={'flex items-baseline gap-3.5'}>
            <span className={'hidden lg:inline text-xss tracking-[.14em] uppercase text-white/60'}>
              {'Naše práce'}
            </span>
            <span
              aria-live={'polite'}
              className={
                'text-xs tracking-[.08em] tabular-nums text-white [text-shadow:0_1px_6px_rgba(0,0,0,.5)] lg:text-primary lg:[text-shadow:none]'
              }
            >
              {counter}
            </span>
          </p>
          <button
            type={'button'}
            aria-label={'Zavřít'}
            onClick={() => dialogRef.current?.close()}
            className={
              'inline-flex h-11 w-11 items-center justify-center bg-accent/60 transition-colors duration-200 hover:text-primary lg:h-12 lg:w-12 lg:border-2 lg:border-white/40 lg:bg-transparent lg:hover:border-white lg:hover:text-white'
            }
          >
            <X size={20} strokeWidth={2.5} aria-hidden={'true'} />
          </button>
        </div>

        <div
          className={
            'flex min-h-0 flex-1 flex-col lg:flex-row lg:items-center lg:justify-center lg:gap-8 lg:px-10 xl:gap-16'
          }
        >
          <button
            type={'button'}
            aria-label={'Předchozí fotka'}
            disabled={index === 0}
            onClick={() => go(index - 1)}
            className={`${arrowBase} border-white/40 text-white enabled:hover:border-white`}
          >
            <ChevronLeft size={22} strokeWidth={2.5} aria-hidden={'true'} />
          </button>

          <div
            className={
              'relative h-[min(133.333vw,calc(100dvh-300px))] w-full shrink-0 lg:aspect-[3/4] lg:h-[min(560px,calc(100dvh-220px))] lg:w-auto xl:h-[min(640px,calc(100dvh-220px))]'
            }
          >
            <div
              ref={trackRef}
              onScroll={onTrackScroll}
              className={
                'absolute inset-0 flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'
              }
            >
              {photos.map((p, i) => (
                <div
                  key={p.key}
                  className={'relative h-full w-full shrink-0 snap-center'}
                  aria-hidden={i !== index}
                >
                  {/* Načítat jen aktuální fotku a sousedy. */}
                  {Math.abs(i - index) <= 1 && (
                    <Image
                      src={p.url}
                      alt={p.alt}
                      fill
                      sizes={'(max-width: 1023px) 100vw, 480px'}
                      className={'object-contain'}
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Segmenty jako ve stories (mobil). */}
            <div
              aria-hidden={'true'}
              className={'absolute inset-x-5 bottom-4 flex gap-1 lg:hidden'}
            >
              {photos.map((p, i) => (
                <span
                  key={p.key}
                  className={`h-[3px] flex-1 ${i === index ? 'bg-primary' : 'bg-white/40'}`}
                />
              ))}
            </div>
          </div>

          <div
            className={
              'flex min-h-0 flex-1 flex-col gap-3.5 overflow-y-auto px-5 py-6 lg:w-[300px] lg:flex-none lg:gap-5 lg:overflow-visible lg:p-0 xl:w-[360px]'
            }
          >
            <div className={'flex items-center justify-between'}>
              {/* Bez popisku je nadpis = název služby — štítek by ho jen opakoval. */}
              {photo.service && photo.caption !== photo.service.title ? (
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
              {total > 1 && (
                <span
                  aria-hidden={'true'}
                  className={'text-[12px] leading-4 font-medium text-white/[.55] lg:hidden'}
                >
                  {'← swipe →'}
                </span>
              )}
            </div>
            <h3
              className={
                'text-[26px] leading-[28px] font-extrabold uppercase lg:text-[34px] lg:leading-[36px]'
              }
            >
              {photo.caption}
            </h3>
            <p
              className={
                'whitespace-pre-line text-[14px] leading-[22px] font-medium text-white/[.72] lg:text-[16px] lg:leading-[26px]'
              }
            >
              {photo.text}
            </p>
            <div className={'mt-auto flex gap-2.5 lg:mt-2 lg:flex-col lg:gap-3'}>
              <Link
                href={linkToReserve}
                className={
                  'inline-flex h-[52px] flex-1 items-center justify-center bg-primary px-3 text-[14px] leading-5 font-extrabold uppercase tracking-[.04em] text-white transition-colors duration-200 hover:text-accent lg:h-[57px] lg:flex-none lg:text-xs lg:tracking-[.04em]'
                }
              >
                <span className={'lg:hidden'}>{'Rezervovat'}</span>
                <span className={'hidden lg:inline'}>{reserveLabel(slug)}</span>
              </Link>
              <Link
                href={'/cenik'}
                className={
                  'inline-flex h-[52px] flex-1 items-center justify-center border-2 border-white/40 px-3 text-xss uppercase tracking-[.06em] text-white transition-colors duration-200 hover:border-white lg:h-12 lg:flex-none'
                }
              >
                <span className={'lg:hidden'}>{'Ceník'}</span>
                <span className={'hidden lg:inline'}>{pricelistLabel(slug)}</span>
              </Link>
            </div>
          </div>

          <button
            type={'button'}
            aria-label={'Další fotka'}
            disabled={index === total - 1}
            onClick={() => go(index + 1)}
            className={`${arrowBase} border-white bg-white text-accent enabled:hover:border-primary enabled:hover:bg-primary enabled:hover:text-white`}
          >
            <ChevronRight size={22} strokeWidth={2.5} aria-hidden={'true'} />
          </button>
        </div>

        {/* Miniatury (desktop). */}
        <div
          className={
            'hidden h-[104px] shrink-0 items-end justify-center gap-2 overflow-x-auto px-10 pb-7 lg:flex [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'
          }
        >
          {photos.map((p, i) => (
            <button
              key={p.key}
              type={'button'}
              aria-label={`Fotka ${i + 1} z ${total}`}
              aria-current={i === index ? 'true' : undefined}
              onClick={() => go(i)}
              className={`relative h-[72px] w-[54px] shrink-0 transition-opacity duration-200 ${
                i === index
                  ? 'outline outline-[3px] outline-offset-0 outline-primary'
                  : 'opacity-[.45] hover:opacity-80'
              }`}
            >
              <Image src={p.url} alt={''} fill sizes={'54px'} className={'object-cover'} />
            </button>
          ))}
        </div>
      </div>
    </dialog>
  )
}

export default GalleryViewer
