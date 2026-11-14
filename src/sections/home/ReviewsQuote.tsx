'use client'

import type { ReactNode } from 'react'

import { useState } from 'react'

import { Chevron } from './ui'

interface QuoteReview {
  name: string
  text: string
  sizeClass: string
}

/**
 * Listování recenzí šipkami. Všechny recenze jsou v HTML ze serveru (neaktivní
 * mají `hidden`), JS jen přepíná, která je vidět — vyhledávač vidí celý text.
 */
const ReviewsQuote = ({ reviews, title }: { reviews: QuoteReview[]; title: ReactNode }) => {
  const [active, setActive] = useState(0)
  const n = reviews.length
  const go = (d: number) => setActive((i) => (i + d + n) % n)

  return (
    <>
      <div className={'flex flex-wrap items-end justify-between gap-4'}>
        {title}
        {n > 1 && (
          <div className={'flex gap-2'}>
            <button
              type={'button'}
              aria-label={'Předchozí recenze'}
              onClick={() => go(-1)}
              className={
                'w-12 h-12 lg:w-14 lg:h-14 inline-flex items-center justify-center border-[3px] border-solid border-accent bg-transparent text-accent hover:bg-accent hover:text-white focus-visible:bg-accent focus-visible:text-white focus-visible:outline-none [transition-duration:200ms]'
              }
            >
              <Chevron dir={'left'} />
            </button>
            <button
              type={'button'}
              aria-label={'Další recenze'}
              onClick={() => go(1)}
              className={
                'w-12 h-12 lg:w-14 lg:h-14 inline-flex items-center justify-center border-[3px] border-solid border-accent bg-accent text-white hover:text-primary focus-visible:text-primary focus-visible:outline-[3px] focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-accent [transition-duration:200ms]'
              }
            >
              <Chevron dir={'right'} />
            </button>
          </div>
        )}
      </div>
      <div aria-live={'polite'}>
        {reviews.map((r, i) => (
          <figure
            key={`${r.name}-${i}`}
            hidden={i !== active}
            className={'relative m-0 flex-col gap-5 lg:gap-6 max-w-[980px] [&:not([hidden])]:flex'}
          >
            <p
              role={'img'}
              aria-label={'5 z 5 hvězdiček'}
              className={'m-0 text-[24px] lg:text-[30px] tracking-[4px] text-accent'}
            >
              {'★★★★★'}
            </p>
            <blockquote
              className={`m-0 ${r.sizeClass} leading-[0.98] font-extrabold uppercase break-words`}
            >
              {`„${r.text}“`}
            </blockquote>
            <figcaption className={'text-[16px] lg:text-[20px] font-extrabold'}>
              {`${r.name}, recenze z Googlu`}
            </figcaption>
          </figure>
        ))}
      </div>
    </>
  )
}

export default ReviewsQuote
