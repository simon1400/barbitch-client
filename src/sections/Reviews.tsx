'use client'
import Button from 'components/Button'
import Review, { Stars } from 'components/Review'
import Image from 'next/image'
import React from 'react'
import { ReactGoogleReviews } from 'react-google-reviews'
import { Autoplay } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'

const featurableWidgetId = process.env.FEATURABLE_WIDGET_ID || ''

const CtaReview = () => {
  return (
    <div className={'bg-white py-[50px] md:py-[83px] md:px-[70px] text-center'}>
      <Image
        className={'mx-auto mb-7'}
        src={'/assets/google.png'}
        width={63}
        height={63}
        alt={'google icon'}
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
              style={{ fontFamily: 'Montserrat, Montserrat Fallback' }}
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
              onSlideChange={() => console.log('slide change')}
              onSwiper={(swiper) => console.log(swiper)}
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
