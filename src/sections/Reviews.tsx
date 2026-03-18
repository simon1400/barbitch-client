'use client'
import type { IReview } from 'fetch/reviews'

import Button from 'components/Button'
import Image from 'components/Image'
import { Stars } from 'components/Review'
import dynamic from 'next/dynamic'
import React from 'react'
import { Autoplay } from 'swiper/modules'
import { SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

const Swiper = dynamic(() => import('swiper/react').then((mod) => mod.Swiper), { ssr: false })
const Review = dynamic(() => import('components/Review'))

const CtaReview = () => {
  return (
    <div className={'bg-white py-[50px] md:py-[83px] md:px-[70px] text-center'}>
      <Image
        className={'mx-auto mb-7'}
        src={'/assets/google.png'}
        width={63}
        height={63}
        alt={'google icon'}
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

  const length = mapped.length

  return (
    <section className={'pb-20'}>
      <h2 className={'text-lg lg:text-big uppercase mt-10 lg:mt-20 text-center -mb-1'}>
        {'Recenze'}
      </h2>
      <Swiper
        spaceBetween={40}
        slidesPerView={1}
        loop
        modules={[Autoplay]}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        breakpoints={{
          640: {
            slidesPerView: 2.5,
            spaceBetween: 25,
          },
          768: {
            slidesPerView: 3.5,
            spaceBetween: 30,
          },
        }}
      >
        {mapped.map((item, idx) => {
          if (Math.floor(length / 2) === idx) {
            return (
              <React.Fragment key={`${item.reviewId}cta`}>
                <SwiperSlide>
                  <CtaReview />
                </SwiperSlide>
                <SwiperSlide>
                  <Review data={item} />
                </SwiperSlide>
              </React.Fragment>
            )
          } else {
            return (
              <SwiperSlide key={item.reviewId}>
                <Review data={item} />
              </SwiperSlide>
            )
          }
        })}
      </Swiper>
    </section>
  )
}

export default Reviews
