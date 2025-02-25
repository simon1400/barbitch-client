'use client'
import { CldImage } from 'next-cloudinary'
import dynamic from 'next/dynamic'
import { useState } from 'react'

import { NextJsImage } from './ImageGalery'

import 'yet-another-react-lightbox/styles.css'

// Динамическая загрузка Lightbox (уменьшает FCP)
const Lightbox = dynamic(() => import('yet-another-react-lightbox'), { ssr: false })

export const Galery = ({ data }: { data: IGalery[] }) => {
  const [index, setIndex] = useState(-1)

  return (
    <section>
      <h2 className={'text-lg lg:text-big uppercase mt-10 lg:mt-20 text-center -mb-1'}>
        {'Follow'}
      </h2>

      <div className={'grid grid-cols-3 lg:grid-cols-6 grid-rows-2 lg:grid-rows-1 gap-1'}>
        {data.map((item, i) => (
          <div
            key={item.alternativeText || `Some_key_${i}`}
            className={'relative w-full overflow-hidden cursor-pointer hover:scale-95 duration-200'}
            onClick={() => setIndex(i)}
          >
            {/* Используем aspect-ratio, чтобы избежать CLS */}
            <div className={'relative w-full'} style={{ aspectRatio: '1 / 1' }}>
              <CldImage
                src={item.hash}
                className={'object-cover absolute w-full h-full top-0 left-0'}
                alt={item.alternativeText || `Some_key_${i}`}
                width={400}
                height={400}
                sizes={'(max-width: 1024px) 33vw, 16vw'}
                loading={i < 6 ? 'eager' : 'lazy'} // Первые 6 картинок загружаем сразу
                priority={i < 6} // Улучшаем LCP
              />
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox загружается только при клике */}
      {index >= 0 && (
        <Lightbox
          index={index}
          open={index >= 0}
          close={() => setIndex(-1)}
          slides={data.map((item) => ({ src: item.url }))}
          render={{ slide: NextJsImage }}
        />
      )}
    </section>
  )
}
