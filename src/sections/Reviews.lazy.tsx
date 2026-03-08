'use client'
import dynamic from 'next/dynamic'

const Reviews = dynamic(() => import('sections/Reviews'), { ssr: false })

const LazyReviews = () => <Reviews />

export default LazyReviews
