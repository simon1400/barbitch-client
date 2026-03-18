'use client'
import type { IReview } from 'fetch/reviews'

import dynamic from 'next/dynamic'

const Reviews = dynamic(() => import('sections/Reviews'), { ssr: false })

const LazyReviews = ({ reviews }: { reviews: IReview[] }) => <Reviews reviews={reviews} />

export default LazyReviews
