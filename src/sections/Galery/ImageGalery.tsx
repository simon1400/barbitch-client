import type { CSSProperties } from 'react'
import type { Slide, SlideImage } from 'yet-another-react-lightbox'

import Image from 'next/image'
import {
  isImageFitCover,
  isImageSlide,
  useLightboxProps,
  useLightboxState,
} from 'yet-another-react-lightbox'

interface NextJsImageProps {
  slide: Slide
  offset: number
  rect: { width: number; height: number }
}

const isNextJsImage = (slide: Slide): slide is SlideImage & { src: string } => {
  return isImageSlide(slide) && typeof slide.src === 'string'
}

export const NextJsImage = ({ slide, offset, rect }: NextJsImageProps) => {
  const {
    on: { click },
    carousel: { imageFit },
  } = useLightboxProps()

  const { currentIndex } = useLightboxState()

  if (!isNextJsImage(slide)) return null

  const cover = isImageFitCover(slide, imageFit)

  const hasSize = typeof slide.width === 'number' && typeof slide.height === 'number'

  const width =
    !cover && hasSize
      ? Math.round(Math.min(rect.width, (rect.height / slide.height) * slide.width))
      : rect.width

  const height =
    !cover && hasSize
      ? Math.round(Math.min(rect.height, (rect.width / slide.width) * slide.height))
      : rect.height

  const styles: CSSProperties = {
    objectFit: cover ? 'cover' : 'contain',
    cursor: click ? 'pointer' : 'default',
  }

  return (
    <div style={{ position: 'relative', width, height }}>
      <Image
        src={slide.src}
        alt={slide.alt || ''}
        {...(hasSize ? { width, height } : { fill: true })}
        style={styles}
        sizes={'(max-width: 768px) 90vw, (max-width: 1200px) 50vw, 30vw'}
        priority={offset === 0}
        decoding={'async'}
        draggable={false}
        onClick={offset === 0 ? () => click?.({ index: currentIndex }) : undefined}
      />
    </div>
  )
}
