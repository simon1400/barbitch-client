import type { IReview } from 'fetch/reviews'

import Button from 'components/Button'
import Image from 'components/Image'
import Review, { Stars } from 'components/Review'
import React from 'react'

/**
 * Recenze serverově.
 *
 * Dřív to byl Swiper s `ssr: false` (a na hlavní stránce navíc celá sekce přes
 * `Reviews.lazy`), takže v HTML zbyl jen nadpis „Recenze“ bez obsahu — pro
 * vyhledávač signál tenké sekce. Vodorovný `scroll-snap` dělá totéž bez JS:
 * na dotyku se listuje prstem, na desktopu kolečkem/táhnutím.
 */
const CtaReview = () => {
  return (
    <div className={'bg-white py-[50px] md:py-[83px] md:px-[70px] text-center h-full'}>
      <Image
        className={'mx-auto mb-7'}
        src={'/assets/google.png'}
        width={63}
        height={63}
        alt={''}
        loading={'lazy'}
        quality={80}
      />
      <div className={'mx-auto mb-5'}>
        <Stars star={5} />
      </div>
      <p className={'text-resMd1 md:text-h5 mb-7 font-bold'}>{'Budeme rádi za vaše hodnocení!'}</p>
      <Button
        text={'NAPSAT RECENZI'}
        small
        href={'https://g.page/r/CWD-fYwFfro0EBM/review'}
        blank
      />
    </div>
  )
}

const Reviews = ({ reviews }: { reviews: IReview[] }) => {
  if (!reviews || reviews.length === 0) return null

  const mapped = reviews.map((r, i) => ({
    reviewId: `review-${i}`,
    comment: r.comment,
    reviewer: {
      displayName: r.reviewerName,
      profilePhotoUrl: r.reviewerPhoto,
    },
    starRating: r.rating,
  }))

  const ctaIndex = Math.floor(mapped.length / 2)

  const slideCls =
    'snap-start shrink-0 basis-[85%] sm:basis-[42%] md:basis-[30%] lg:basis-[27%] h-auto'

  return (
    <section className={'pb-20'} aria-labelledby={'recenze'}>
      <h2
        id={'recenze'}
        className={'text-lg lg:text-big uppercase mt-10 lg:mt-20 text-center -mb-1'}
      >
        {'Recenze'}
      </h2>
      <div
        className={
          'flex gap-6 md:gap-8 overflow-x-auto snap-x snap-mandatory scroll-px-4 px-4 pt-10 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'
        }
      >
        {mapped.map((item, idx) => (
          <React.Fragment key={item.reviewId}>
            {idx === ctaIndex && (
              <div className={slideCls}>
                <CtaReview />
              </div>
            )}
            <div className={slideCls}>
              <Review data={item} />
            </div>
          </React.Fragment>
        ))}
      </div>
    </section>
  )
}

export default Reviews
