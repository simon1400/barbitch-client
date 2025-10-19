'use client'
import { Container } from 'components/Container'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import { useState } from 'react'
import { NextJsImage } from 'sections/Galery/ImageGalery'

import 'yet-another-react-lightbox/styles.css'

const Lightbox = dynamic(() => import('yet-another-react-lightbox'), { ssr: false })
const MasonryGrid = dynamic(
  () => import('sections/Masonry/MasonryGrid').then((mod) => mod.MasonryGrid),
  {
    ssr: false,
  },
)

export const Galery = ({
  data,
  contain = true,
  variant = 'simple',
}: {
  data: { image: IGalery[] }
  contain?: boolean
  variant?: 'simple' | 'masonry'
}) => {
  const [index, setIndex] = useState(-1)

  if (!data || !data.image || !Array.isArray(data.image) || data.image.length === 0) {
    return null
  }

  const length = data.image.length

  // Masonry variant - полноэкранная галерея с lightbox
  if (variant === 'masonry') {
    return (
      <section
        className={'overflow-x-hidden mb-15 px-2 md:px-5'}
        aria-labelledby={'masonry-gallery'}
      >
        <h2 id={'masonry-gallery'} className={'sr-only'}>
          {'Masonry Gallery'}
        </h2>
        <MasonryGrid>
          {data.image.map((image, idx) => (
            <div
              key={`${image.hash}-${idx}`}
              className={'cursor-pointer transition-opacity hover:opacity-90 duration-200 w-full'}
              onClick={() => setIndex(idx)}
            >
              <img
                src={image.url}
                alt={image.alternativeText || `Obrázek ${idx + 1} z galerie`}
                loading={'lazy'}
                className={'w-full h-auto block'}
              />
            </div>
          ))}
        </MasonryGrid>
        {index >= 0 && (
          <Lightbox
            index={index}
            open={index >= 0}
            close={() => setIndex(-1)}
            slides={data.image.map((item) => ({ src: item.url }))}
            render={{ slide: NextJsImage }}
          />
        )}
      </section>
    )
  }

  // Simple variant - обычная галерея в контейнере
  return (
    <section className={'pt-0 pb-12 mb:pb-17'}>
      <Container size={'xl'}>
        <div
          className={`grid grid-cols-${length > 1 ? '2' : length} md:grid-cols-${length >= 3 ? '3' : length} gap-4 md:gap-8`}
        >
          {data.image.map((item, index) => (
            <div key={item.documentId} className={`${!contain && 'pt-[100%]'} relative`}>
              <Image
                className={`${contain ? 'object-contain' : 'object-cover'} object-center`}
                src={item.url}
                width={length > 1 ? 700 : 1400}
                height={1000}
                fill={!contain}
                alt={item.alternativeText || ''}
                loading={index < 3 ? 'eager' : 'lazy'}
                sizes="(max-width: 768px) 50vw, 33vw"
              />
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}
