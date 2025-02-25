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

// Type Guard для проверки slide на SlideImage
const isNextJsImage = (slide: Slide): slide is SlideImage & { src: string } => {
  return (
    isImageSlide(slide) &&
    typeof slide.width === 'number' &&
    typeof slide.height === 'number' &&
    typeof slide.src === 'string'
  )
}

export const NextJsImage = ({ slide, offset, rect }: NextJsImageProps) => {
  const {
    on: { click },
    carousel: { imageFit },
  } = useLightboxProps()

  const { currentIndex } = useLightboxState()

  if (!isNextJsImage(slide)) return null

  const cover = isImageFitCover(slide, imageFit)

  const width = !cover
    ? Math.round(Math.min(rect.width, (rect.height / (slide.height || 1)) * (slide.width || 1)))
    : rect.width

  const height = !cover
    ? Math.round(Math.min(rect.height, (rect.width / (slide.width || 1)) * (slide.height || 1)))
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
        width={width}
        height={height}
        style={styles}
        sizes={'(max-width: 768px) 90vw, (max-width: 1200px) 50vw, 30vw'} // Улучшает адаптивность
        priority={offset === 0} // Только активный слайд грузим с приоритетом
        decoding={'async'} // Улучшает рендеринг
        draggable={false}
        onClick={offset === 0 ? () => click?.({ index: currentIndex }) : undefined}
      />
    </div>
  )
}
