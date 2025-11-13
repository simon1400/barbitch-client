'use client'

import { BLUR_DATA_URL } from 'lib/image-utils'
import Image from 'next/image'

interface ImageKitImageProps {
  src: string
  alt: string
  width: number
  height: number
  className?: string
  sizes?: string
  priority?: boolean
  loading?: 'lazy' | 'eager'
  transformation?: Array<{ [key: string]: string | number }>
}

const urlEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || ''

export const ImageKitImage = ({
  src,
  alt,
  width,
  height,
  className,
  sizes,
  priority,
  loading = 'lazy',
  transformation = [],
}: ImageKitImageProps) => {
  // Check if src is already a full URL (from ImageKit)
  const isFullUrl = src.startsWith('http')

  // If it's a full ImageKit URL, use it directly
  // Otherwise, construct the URL from path
  const imageUrl = isFullUrl ? src : `${urlEndpoint}${src.startsWith('/') ? '' : '/'}${src}`

  // Build transformation string for ImageKit
  const transformations: string[] = []

  // Add default optimizations for mobile
  transformations.push(`w-${width}`)
  transformations.push(`h-${height}`)
  transformations.push(`q-75`) // Reduced quality for mobile
  transformations.push(`f-auto`) // Auto format (WebP/AVIF)
  transformations.push(`pr-true`) // Progressive rendering

  // Add custom transformations
  transformation.forEach((t) => {
    Object.entries(t).forEach(([key, value]) => {
      transformations.push(`${key}-${value}`)
    })
  })

  // Construct final URL with transformations
  const finalUrl =
    isFullUrl && imageUrl.includes('ik.imagekit.io')
      ? imageUrl.replace(/\/upload\//, `/upload/tr:${transformations.join(',')}/`)
      : imageUrl

  return (
    <Image
      src={finalUrl}
      alt={alt}
      width={width}
      height={height}
      className={className}
      sizes={sizes || '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'}
      priority={priority}
      loading={priority ? 'eager' : loading}
      quality={75}
      placeholder="blur"
      blurDataURL={BLUR_DATA_URL}
    />
  )
}

export default ImageKitImage
