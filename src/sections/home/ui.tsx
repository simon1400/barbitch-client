import type { ReactNode } from 'react'

import Link from 'next/link'

/**
 * Společné kousky nové hlavní stránky (s286, návrh `client/design_handoff_homepage`).
 * Tokeny: růžová #e71e6e, černá #161615, přechod `bg-bb-pink`; nadpisy Montserrat
 * 800 velkými, desktop 64/0.98, mobil 36; odsazení sekcí 96/72 a 56/24.
 */

/** Šířka obsahu: do 1440 px jako v návrhu, na širších monitorech uprostřed. */
export const WRAP = 'mx-auto w-full max-w-[1440px] px-6 lg:px-[72px]'
export const SECTION_Y = 'py-14 lg:py-24'

export const SectionTitle = ({
  children,
  id,
  className = '',
  light = false,
}: {
  children: ReactNode
  id?: string
  className?: string
  light?: boolean
}) => (
  <h2
    id={id}
    className={`m-0 text-[36px] lg:text-[64px] leading-[0.98] font-extrabold uppercase tracking-[-1px] ${light ? 'text-white' : 'text-accent'} ${className}`}
  >
    {children}
  </h2>
)

type Tone = 'dark' | 'outline' | 'white'

const TONES: Record<Tone, string> = {
  // Bílý text na růžové značka nepoužívá — hover jako na zbytku webu: růžový text.
  dark: 'bg-accent text-white hover:text-primary focus-visible:text-primary',
  outline:
    'border-[3px] border-solid border-accent text-accent hover:bg-accent hover:text-white focus-visible:bg-accent focus-visible:text-white',
  white: 'bg-white text-accent hover:text-primary focus-visible:text-primary',
}

/** Obdélníkové tlačítko-odkaz: 48 px mobil / 57 px desktop (`small` = vždy 48). */
export const BbLink = ({
  href,
  children,
  tone = 'dark',
  small = false,
  className = '',
  external = false,
  ...rest
}: {
  href: string
  children: ReactNode
  tone?: Tone
  small?: boolean
  className?: string
  external?: boolean
  'aria-label'?: string
  id?: string
}) => {
  const size = small
    ? 'h-12 px-6 text-[14px]'
    : 'h-12 px-6 text-[14px] lg:h-[57px] lg:px-10 lg:text-[15px]'
  const cls = `inline-flex items-center justify-center box-border font-extrabold uppercase whitespace-nowrap no-underline [transition-property:background-color,color] [transition-duration:200ms] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-accent ${size} ${TONES[tone]} ${className}`
  if (external) {
    return (
      <a href={href} className={cls} target={'_blank'} rel={'noopener noreferrer'} {...rest}>
        {children}
      </a>
    )
  }
  return (
    <Link href={href} className={cls} {...rest}>
      {children}
    </Link>
  )
}

/** Podtržený textový odkaz („Celý ceník“, „Všechny články“). */
export const TextLink = ({
  href,
  children,
  className = '',
  light = false,
}: {
  href: string
  children: ReactNode
  className?: string
  light?: boolean
}) => (
  <Link
    href={href}
    className={`inline-block py-2.5 text-[15px] font-extrabold uppercase underline underline-offset-4 hover:underline-offset-[6px] [transition-duration:200ms] ${light ? 'text-white' : 'text-accent hover:text-accent'} ${className}`}
  >
    {children}
  </Link>
)

/** Čtyřcípá jiskra z návrhu (dekorace, `aria-hidden`). */
export const Sparkle = ({
  size = 20,
  className = '',
  opacity = 0.9,
}: {
  size?: number
  className?: string
  opacity?: number
}) => (
  <svg
    aria-hidden={'true'}
    width={size}
    height={size}
    viewBox={'0 0 20 20'}
    className={`absolute pointer-events-none ${className}`}
  >
    <path
      d={'M10 0 L11.5 8 L20 10 L11.5 12 L10 20 L8.5 12 L0 10 L8.5 8 Z'}
      fill={'#ffffff'}
      opacity={opacity}
    />
  </svg>
)

export const Heart = ({ className = '', size = 24 }: { className?: string; size?: number }) => (
  <svg
    aria-hidden={'true'}
    width={size}
    height={Math.round((size * 22) / 24)}
    viewBox={'0 0 24 22'}
    className={`shrink-0 ${className}`}
  >
    <path
      d={
        'M12 21.5 C5 15.5 0 11.5 0 6.2 C0 2.7 2.7 0 6.1 0 C8.6 0 10.9 1.4 12 3.6 C13.1 1.4 15.4 0 17.9 0 C21.3 0 24 2.7 24 6.2 C24 11.5 19 15.5 12 21.5 Z'
      }
      className={'fill-current'}
    />
  </svg>
)

/** Šipka vpravo (dlaždice týmu, pásky). */
export const ArrowRight = ({
  size = 22,
  className = '',
}: {
  size?: number
  className?: string
}) => (
  <svg
    aria-hidden={'true'}
    width={size}
    height={size}
    viewBox={'0 0 24 24'}
    fill={'none'}
    className={`stroke-current ${className}`}
    strokeWidth={3}
  >
    <path d={'M4 12h16M13 5l7 7-7 7'} />
  </svg>
)

export const Chevron = ({ dir, className = '' }: { dir: 'left' | 'right'; className?: string }) => (
  <svg
    aria-hidden={'true'}
    width={20}
    height={20}
    viewBox={'0 0 24 24'}
    fill={'none'}
    className={`stroke-current ${className}`}
    strokeWidth={3}
  >
    <path d={dir === 'left' ? 'M15 5l-7 7 7 7' : 'M9 5l7 7-7 7'} />
  </svg>
)
