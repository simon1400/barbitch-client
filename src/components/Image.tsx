'use client'
import type { ImageProps } from 'next/image'

import imageLoader from 'lib/image-loader'
import NextImage from 'next/image'

export default function Image(props: ImageProps) {
  return <NextImage loader={imageLoader} {...props} />
}
