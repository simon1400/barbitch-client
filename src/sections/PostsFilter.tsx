'use client'

import { topicKey } from 'lib/blogTopic'
import { useEffect, useState } from 'react'

import { MasonryGrid } from './Masonry/MasonryGrid'

const pill = (active: boolean) =>
  `inline-block px-3 py-2 text-[13px] md:px-4 md:text-[14px] font-bold uppercase tracking-[1px] border border-accent duration-300 ${
    active
      ? 'bg-accent text-white hover:text-white'
      : 'text-accent hover:bg-accent hover:text-white'
  }`

const readTopic = (known: string[]) => {
  const key = topicKey(new URLSearchParams(window.location.search).get('tema'))
  return key && known.includes(key) ? key : ''
}

/**
 * Filtr /blog podle tématu (s303) — v prohlížeči nad kartami, které vykreslil
 * server. Adresa `?tema=` se drží v historii (sdílený odkaz otevře téma), ale
 * server ji nečte, takže stránka zůstává statická. Bez JS je vidět celý výpis.
 */
export const PostsFilter = ({
  topics,
  featured,
  cards,
}: {
  topics: { key: string; label: string }[]
  /** Velký článek pro každé téma; klíč '' = bez filtru. */
  featured: Record<string, { slug: string; node: React.ReactNode }>
  cards: { slug: string; topic: string; node: React.ReactNode }[]
}) => {
  const [active, setActive] = useState('')

  useEffect(() => {
    const known = topics.map((t) => t.key)
    const sync = () => setActive(readTopic(known))
    sync()
    window.addEventListener('popstate', sync)
    return () => window.removeEventListener('popstate', sync)
  }, [topics])

  const choose = (event: React.MouseEvent<HTMLAnchorElement>, key: string) => {
    // Ctrl/⌘ + klik = nová karta, to necháme prohlížeči.
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return
    event.preventDefault()
    if (key === active) return
    setActive(key)
    window.history.pushState(null, '', key ? `/blog?tema=${key}` : '/blog')
  }

  const top = featured[active]
  const rest = cards.filter((card) => (!active || card.topic === active) && card.slug !== top?.slug)

  return (
    <>
      {topics.length > 1 && (
        <nav aria-label={'Témata článků'} className={'mb-10 md:mb-14'}>
          <ul className={'flex flex-wrap gap-2.5'}>
            {[{ key: '', label: 'Vše' }, ...topics].map(({ key, label }) => (
              <li key={key || 'vse'}>
                <a
                  href={key ? `/blog?tema=${key}` : '/blog'}
                  onClick={(event) => choose(event, key)}
                  className={pill(active === key)}
                  aria-current={active === key ? 'page' : undefined}
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}
      {top?.node}
      {rest.length > 0 && (
        <>
          <h2 className={'text-resTop md:text-xxl mb-12 md:mb-17.5 text-center'}>
            {top ? 'STARŠÍ PŘÍSPĚVKY' : 'PŘÍSPĚVKY'}
          </h2>
          <div>
            <MasonryGrid sm={1}>
              {rest.map((card) => (
                <div key={card.slug}>{card.node}</div>
              ))}
            </MasonryGrid>
          </div>
        </>
      )}
    </>
  )
}
