import type { IGalleryItem } from 'fetch/homepage'
import type { IReview } from 'fetch/reviews'

import Image from 'components/Image'
import { quoteSizeClass, REVIEW_URL, truncateWords } from 'lib/homeContent'

import ReviewsQuote from './ReviewsQuote'
import { BbLink, SECTION_Y, SectionTitle, Sparkle, WRAP } from './ui'

/**
 * „Recenze“ na hlavní stránce (s286): jedna velká citace, šipky listují.
 * Jen 5★, delší než ~180 znaků se zkrátí po slovech (rozhodnutí majitele 13.11).
 * Celkové hodnocení Googlu ani počet recenzí se neukazuje a `aggregateRating`
 * se do značkování nedává. Stránka /cenik dál používá `sections/Reviews`.
 */
const HomeReviews = ({ reviews, gallery }: { reviews: IReview[]; gallery: IGalleryItem[] }) => {
  const list = reviews
    .filter((r) => r.rating === 5 && r.comment?.trim() && r.reviewerName?.trim())
    .map((r) => {
      const text = truncateWords(r.comment)
      return { name: r.reviewerName.trim(), text, sizeClass: quoteSizeClass(text) }
    })
  if (!list.length) return null
  const photo = gallery.find((g) => g.image?.url)?.image

  return (
    <section
      aria-labelledby={'recenze'}
      className={`relative overflow-hidden bg-bb-pink ${SECTION_Y}`}
    >
      {photo?.url && (
        <Image
          src={photo.url}
          alt={''}
          fill
          sizes={'100vw'}
          loading={'lazy'}
          className={
            'object-cover opacity-35 [filter:grayscale(1)_contrast(1.1)] mix-blend-screen [mask-image:linear-gradient(90deg,transparent_35%,#000_80%)]'
          }
        />
      )}
      <Sparkle size={24} className={'top-[60px] left-[90%]'} />
      <div className={`${WRAP} relative flex flex-col gap-8 lg:gap-12`}>
        <ReviewsQuote
          reviews={list}
          title={<SectionTitle id={'recenze'}>{'Recenze'}</SectionTitle>}
        />
        <div
          className={
            'flex flex-wrap items-center justify-between gap-5 pt-7 border-t-[3px] border-solid border-accent'
          }
        >
          <p className={'m-0 text-[16px] lg:text-[20px] font-extrabold'}>
            {'Byla jsi u nás? Napiš, jak se ti líbilo.'}
          </p>
          <BbLink href={REVIEW_URL} external className={'w-full lg:w-auto'}>
            {'Napsat recenzi'}
          </BbLink>
        </div>
      </div>
    </section>
  )
}

export default HomeReviews
