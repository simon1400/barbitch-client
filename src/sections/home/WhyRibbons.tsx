import type { IWhyItem } from 'fetch/home'

import Link from 'next/link'

import { Heart, SectionTitle, WRAP } from './ui'

/** Parametry pásek podle návrhu: náklon, délka cyklu, směr (sousední proti sobě). */
const RIBBONS = [
  { tilt: '-rotate-[3deg]', anim: 'animate-[marquee_88s_linear_infinite]' },
  { tilt: 'rotate-[2deg]', anim: 'animate-[marquee-rev_76s_linear_infinite]' },
  { tilt: '-rotate-[1.5deg]', anim: 'animate-[marquee_100s_linear_infinite]' },
  { tilt: 'rotate-[2.5deg]', anim: 'animate-[marquee-rev_84s_linear_infinite]' },
]

/** Kolik opakování na polovinu dráhy — polovina musí být širší než páska i na 2560 px. */
const REPEAT = 5

const TEXT =
  'text-[19px] lg:text-[24px] leading-none font-extrabold uppercase tracking-[0.5px] whitespace-nowrap'

const Arrow = () => (
  <svg
    aria-hidden={'true'}
    width={26}
    height={22}
    viewBox={'0 0 26 22'}
    fill={'none'}
    className={'shrink-0 stroke-current'}
    strokeWidth={3.5}
  >
    <path d={'M2 11h21M14 2l9 9-9 9'} />
  </svg>
)

/** Jedno opakování: nadpis ♥ text ♥ [odkaz →] ♥. První opakování nese H3 a <p>. */
const Unit = ({ item, semantic }: { item: IWhyItem; semantic: boolean }) => {
  const hasLink = !!item.linkUrl && !!item.linkLabel
  const heart = (
    <Heart className={'text-accent group-hover:text-primary group-focus-visible:text-primary'} />
  )
  return (
    <span className={'flex items-center gap-[22px] lg:gap-7 pr-[22px] lg:pr-7'}>
      {semantic ? (
        <h3 className={`m-0 ${TEXT}`}>{item.title}</h3>
      ) : (
        <span className={TEXT}>{item.title}</span>
      )}
      {heart}
      {!!item.text && (
        <>
          {semantic ? (
            <p className={`m-0 ${TEXT}`}>{item.text}</p>
          ) : (
            <span className={TEXT}>{item.text}</span>
          )}
          {heart}
        </>
      )}
      {hasLink && (
        <>
          <span
            className={`${TEXT} inline-flex items-center gap-2.5 underline underline-offset-[5px]`}
          >
            {item.linkLabel}
            <Arrow />
          </span>
          {heart}
        </>
      )}
    </span>
  )
}

/**
 * „Proč Barbitch“ (s286): čtyři růžové pásky přes celou šířku, čistý CSS marquee
 * (`translateX(0 → −50%)`), pauza při najetí, `prefers-reduced-motion` = stojí.
 * Páska s `linkUrl` je odkaz; skutečný text (H3 + <p>) je v pásce jednou,
 * opakování jsou `aria-hidden`. Data: `homepage.whyItems`.
 */
const WhyRibbons = ({ items }: { items: IWhyItem[] }) => {
  const list = items.filter((i) => i?.title?.trim()).slice(0, RIBBONS.length)
  if (!list.length) return null

  return (
    <section
      aria-labelledby={'proc-barbitch'}
      className={'bg-white pt-14 pb-20 lg:pt-24 lg:pb-[130px] overflow-hidden'}
    >
      <div className={WRAP}>
        <SectionTitle id={'proc-barbitch'}>{'Proč Barbitch'}</SectionTitle>
      </div>
      <div className={'mt-10 lg:mt-16 flex flex-col gap-[30px] lg:gap-[46px]'}>
        {list.map((item, i) => {
          const r = RIBBONS[i]
          const track = (
            <span
              className={`flex w-max h-full items-center ${r.anim} group-hover/rib:[animation-play-state:paused] group-focus-within/rib:[animation-play-state:paused] motion-reduce:animate-none`}
            >
              {Array.from({ length: REPEAT * 2 }, (_, k) => (
                <span key={k} aria-hidden={k > 0 ? 'true' : undefined} className={'flex'}>
                  <Unit item={item} semantic={k === 0} />
                </span>
              ))}
            </span>
          )
          const cls = `group/rib block w-[120%] -ml-[10%] h-[50px] lg:h-[66px] bg-primary text-accent overflow-hidden no-underline ${r.tilt} [transition-property:background-color] [transition-duration:200ms]`
          return item.linkUrl && item.linkLabel ? (
            <Link
              key={item.title}
              href={item.linkUrl}
              aria-label={`${item.title}: ${item.linkLabel}`}
              className={`group ${cls} hover:bg-accent hover:text-white focus-visible:bg-accent focus-visible:text-white focus-visible:outline-none`}
            >
              {track}
            </Link>
          ) : (
            <div key={item.title} className={cls}>
              {track}
            </div>
          )
        })}
      </div>
    </section>
  )
}

export default WhyRibbons
