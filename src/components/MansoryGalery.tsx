'use client'
import dynamic from 'next/dynamic'
import { useState } from 'react'
import { NextJsImage } from 'sections/Galery/ImageGalery'

import 'yet-another-react-lightbox/styles.css'

const Lightbox = dynamic(() => import('yet-another-react-lightbox'), { ssr: false })
const CldImage = dynamic(() => import('next-cloudinary').then((mod) => mod.CldImage), {
  ssr: false,
})
const MasonryGrid = dynamic(() => import('sections/Masonry/MasonryGrid').then((mod) => mod.MasonryGrid), {
  ssr: false,
})

interface Image {
  name: string
  hash: string
  url: string
  alternativeText: string
}

interface MasonryGalleryProps {
  images: Image[]
}

export const MasonryGalery = ({ images }: MasonryGalleryProps) => {
  const [index, setIndex] = useState(-1)
  return (
    <section className={'overflow-x-hidden mb-15'} aria-labelledby={'masonry-gallery'}>
      <h2 id={'masonry-gallery'} className={'sr-only'}>
        {'Masonry Gallery'}
      </h2>
      <MasonryGrid key={index} className={'mx-3'}>
        {images.map((image, idx) => (
          <div
            key={`${image.hash}-${index}`}
            className={'relative cursor-pointer'}
            onClick={() => setIndex(idx)}
          >
            <CldImage
              src={image.hash}
              width={600}
              height={600}
              alt={image.alternativeText || `Obrázek ${idx + 1} z galerie: ${image.name}`}
              loading={'lazy'}
            />
          </div>
        ))}
      </MasonryGrid>
      {index >= 0 && (
        <Lightbox
          index={index}
          open={index >= 0}
          close={() => setIndex(-1)}
          slides={images.map((item) => ({ src: item.url }))}
          render={{ slide: NextJsImage }}
        />
      )}
    </section>
  )
}
