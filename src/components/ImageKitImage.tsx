'use client'

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

  // Add default optimizations
  transformations.push(`w-${width}`)
  transformations.push(`h-${height}`)
  transformations.push(`q-80`)
  transformations.push(`f-auto`)

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
      sizes={sizes}
      priority={priority}
      loading={priority ? 'eager' : loading}
      quality={80}
    />
  )
}

export default ImageKitImage
