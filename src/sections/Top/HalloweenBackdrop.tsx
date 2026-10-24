'use client'

import type { CSSProperties } from 'react'

import Image from 'components/Image'
import { useEffect, useRef } from 'react'

// Překryvy fotky. Desktop (1B) a mobil (2A) mají jiný výřez, takže i jiné
// stíny — přepínají se na `lg`, stejně jako hlavička.
const DESKTOP_LAYERS: CSSProperties[] = [
  {
    background:
      'radial-gradient(ellipse 55% 65% at 68% 68%, rgba(0,0,0,0) 0%, rgba(22,22,21,.5) 70%, #161615 100%)',
  },
  {
    background:
      'linear-gradient(to right, rgba(22,22,21,.9) 0%, rgba(22,22,21,.7) 38%, rgba(22,22,21,0) 62%)',
  },
  {
    background: 'linear-gradient(to top, #161615 0%, rgba(22,22,21,.75) 10%, rgba(22,22,21,0) 30%)',
  },
]

const MOBILE_LAYERS: CSSProperties[] = [
  {
    background:
      'radial-gradient(ellipse 70% 45% at 66% 47%, rgba(0,0,0,0) 0%, rgba(22,22,21,.5) 70%, #161615 100%)',
  },
  {
    background:
      'linear-gradient(to top, #161615 0%, #161615 14%, rgba(22,22,21,.9) 30%, rgba(22,22,21,0) 52%)',
  },
  {
    background: 'linear-gradient(to bottom, rgba(22,22,21,.8) 0%, rgba(22,22,21,0) 28%)',
  },
]

// Fotka stěny salonu s lebkou, blikající světlo a stíny pod text.
// Paralaxa jen na desktopu s myší a bez `prefers-reduced-motion`: posun se
// píše rovnou do CSS proměnných vrstvy, bez re-renderu na každý pohyb myši.
// Posluchač visí na rodičovské sekci — nad nadpisem a tlačítky by se jinak
// vrstva pod nimi o pohybu nedozvěděla.
export default function HalloweenBackdrop() {
  const rootRef = useRef<HTMLDivElement>(null)
  const layerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = rootRef.current?.parentElement
    const layer = layerRef.current
    if (!section || !layer) return

    const desktop = window.matchMedia('(min-width: 1024px)')
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)')

    const shift = (x: number, y: number) => {
      layer.style.setProperty('--tw-translate-x', `${x}px`)
      layer.style.setProperty('--tw-translate-y', `${y}px`)
    }

    const onMove = (e: MouseEvent) => {
      if (!desktop.matches || reduce.matches) return
      const rect = section.getBoundingClientRect()
      const bx = (e.clientX - rect.left) / rect.width - 0.5
      const by = (e.clientY - rect.top) / rect.height - 0.5
      shift(bx * 30, by * 20)
    }
    const onLeave = () => shift(0, 0)

    section.addEventListener('mousemove', onMove)
    section.addEventListener('mouseleave', onLeave)
    return () => {
      section.removeEventListener('mousemove', onMove)
      section.removeEventListener('mouseleave', onLeave)
    }
  }, [])

  return (
    <div ref={rootRef} className={'absolute inset-0 lg:-inset-10 overflow-hidden'} aria-hidden>
      <div
        ref={layerRef}
        className={
          'absolute inset-0 lg:scale-[1.04] transition-transform [transition-duration:350ms] ease-out'
        }
      >
        {/* Mobil: výřez z makety 2A (lebka vpravo nad nadpisem). Na 390×844 je
            to přesně 1620×1013 px, left -825, top -350 — tady v procentech
            výšky sekce, aby fotka dosáhla dolů i na vysokém tabletu.
            Desktop: celá plocha, lebka vpravo dole. */}
        <Image
          src={'/assets/halloween/wall.jpg'}
          alt={''}
          width={1920}
          height={1200}
          priority
          sizes={'100vw'}
          className={
            'absolute max-w-none w-auto h-[120%] top-[-41.5%] right-0 translate-x-1/4 object-cover saturate-[1.1] contrast-[1.08] lg:inset-0 lg:w-full lg:h-full lg:translate-x-0 lg:object-[50%_55%]'
          }
        />
      </div>

      <div className={'absolute inset-0 bg-accent opacity-[.42] motion-safe:animate-lamp'} />

      {DESKTOP_LAYERS.map((style) => (
        <div
          key={String(style.background)}
          className={'absolute inset-0 hidden lg:block'}
          style={style}
        />
      ))}
      {MOBILE_LAYERS.map((style) => (
        <div
          key={String(style.background)}
          className={'absolute inset-0 lg:hidden'}
          style={style}
        />
      ))}
    </div>
  )
}
