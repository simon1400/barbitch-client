'use client'

import { useEffect, useState } from 'react'

/**
 * Běžící páska (CSS `translateX(0 → −50%)`) bez opakování v HTML (s305).
 *
 * Dřív server posílal 8–10 kopií každé pásky — na hlavní stránce ~100 KB HTML
 * a totéž znovu v RSC payloadu. Teď server vykreslí jen `first` (skutečný text
 * pro vyhledávače a čtečky) a kopie `copy` doplní prohlížeč po hydrataci
 * (`aria-hidden` + `inert`, mimo pořadí Tab). Animace se zapne až s kopiemi —
 * s jediným kusem by `−50 %` skákalo.
 *
 * `total` = počet kusů celkem (sudý: dvě stejné poloviny dráhy); polovina musí
 * být širší než páska i na 2560 px.
 */
export const Marquee = ({
  first,
  copy,
  total,
  className,
  animClass,
  as: Tag = 'span',
}: {
  first: React.ReactNode
  copy: React.ReactNode
  total: number
  className: string
  animClass: string
  as?: 'span' | 'div'
}) => {
  const [ready, setReady] = useState(false)
  useEffect(() => setReady(true), [])

  return (
    <Tag className={`${className} ${ready ? animClass : ''}`}>
      {first}
      {ready &&
        Array.from({ length: total - 1 }, (_, k) => (
          <span key={k} aria-hidden={'true'} inert className={'flex shrink-0 items-center'}>
            {copy}
          </span>
        ))}
    </Tag>
  )
}
