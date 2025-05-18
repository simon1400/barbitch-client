'use client'
import { CldImage } from 'next-cloudinary'
import dynamic from 'next/dynamic'
import { useState } from 'react'
import { NextJsImage } from 'sections/Galery/ImageGalery'
import { MasonryGrid } from 'sections/MasonryGrid'

import 'yet-another-react-lightbox/styles.css'

const Lightbox = dynamic(() => import('yet-another-react-lightbox'), { ssr: false })

interface Image {
  name: string
  hash: string
  url: string
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
              alt={`Obrázek ${idx + 1} z galerie: ${image.name}`}
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
