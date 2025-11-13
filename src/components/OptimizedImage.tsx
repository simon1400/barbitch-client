'use client'

import type { ImageProps } from 'next/image'

import { BLUR_DATA_URL } from 'lib/image-utils'
import Image from 'next/image'

interface OptimizedImageProps extends Omit<ImageProps, 'quality' | 'placeholder'> {
  quality?: number
  mobileQuality?: number
  priority?: boolean
}

/**
 * Optimized Image component for mobile devices
 * Automatically uses lower quality on mobile to speed up loading
 */
export const OptimizedImage = ({
  quality = 75,
  mobileQuality = 60,
  priority = false,
  sizes,
  ...props
}: OptimizedImageProps) => {
  // Default sizes if not provided
  const defaultSizes = sizes || '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'

  return (
    <Image
      {...props}
      quality={quality}
      sizes={defaultSizes}
      priority={priority}
      loading={priority ? 'eager' : 'lazy'}
      placeholder="blur"
      blurDataURL={BLUR_DATA_URL}
    />
  )
}

export default OptimizedImage
