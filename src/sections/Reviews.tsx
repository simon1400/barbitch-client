'use client'
import Button from 'components/Button'
import { Stars } from 'components/Review'
import dynamic from 'next/dynamic'
import { Montserrat } from 'next/font/google'
import Image from 'next/image'
import React from 'react'
import { Autoplay } from 'swiper/modules'
import { SwiperSlide } from 'swiper/react'

const featurableWidgetId = process.env.FEATURABLE_WIDGET_ID || ''

const ReactGoogleReviews = dynamic(
  () => import('react-google-reviews').then((mod) => mod.ReactGoogleReviews),
  { ssr: false },
)

const Swiper = dynamic(() => import('swiper/react').then((mod) => mod.Swiper), { ssr: false })
const Review = dynamic(() => import('components/Review'))

const montserat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '700'],
  display: 'swap',
})

const CtaReview = () => {
  return (
    <div className={'bg-white py-[50px] md:py-[83px] md:px-[70px] text-center'}>
      <Image
        className={'mx-auto mb-7'}
        src={'/assets/google.png'}
        width={63}
        height={63}
        alt={'google icon'}
        loading="lazy"
        quality={80}
      />
      <div className={'mx-auto mb-5'}>
        <Stars star={5} />
      </div>
      <h5 className={'text-resMd1 md:text-h5 mb-7'}>{'Budeme rádi za vaše hodnocení!'}</h5>
      <Button
        text={'NAPSAT RECENZI'}
        small
        href={'https://g.page/r/CWD-fYwFfro0EBM/review'}
        blank
      />
    </div>
  )
}

const Reviews = () => {
  return (
    <section className={'pb-20'}>
      <h2 className={'text-lg lg:text-big uppercase mt-10 lg:mt-20 text-center -mb-1'}>
        {'Recenze'}
      </h2>
      <ReactGoogleReviews
        layout={'custom'}
        featurableId={featurableWidgetId}
        renderer={(reviews) => {
          const length = reviews.length
          return (
            <Swiper
              spaceBetween={40}
              slidesPerView={1}
              className={montserat.className}
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
              {reviews.map((item, idx) => {
                if (length / 2 === idx) {
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
          )
        }}
      />
    </section>
  )
}

export default Reviews
