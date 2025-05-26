'use client'
import dynamic from 'next/dynamic'
import { useState } from 'react'

import { NextJsImage } from './ImageGalery'

import 'yet-another-react-lightbox/styles.css'

const Lightbox = dynamic(() => import('yet-another-react-lightbox'), { ssr: false })
const CldImage = dynamic(() => import('next-cloudinary').then((mod) => mod.CldImage), {
  ssr: false,
})

const Galery = ({ data }: { data: IGalery[] }) => {
  const [index, setIndex] = useState(-1)

  return (
    <section className={'pb-23 lg:pb-20'}>
      <h2 className={'text-lg lg:text-big uppercase mt-10 lg:mt-20 text-center -mb-1'}>
        {'Práce'}
      </h2>

      <div className={'grid grid-cols-3 lg:grid-cols-6 grid-rows-2 lg:grid-rows-1 gap-1'}>
        {data.map((item, i) => (
          <div
            key={item.alternativeText || `Some_key_${i}`}
            className={'relative w-full overflow-hidden cursor-pointer hover:scale-95 duration-200'}
            onClick={() => setIndex(i)}
          >
            <div className={'relative w-full'} style={{ aspectRatio: '1 / 1' }}>
              <CldImage
                src={item.hash}
                className={'object-cover absolute w-full h-full top-0 left-0'}
                alt={item.alternativeText || `Some_key_${i}`}
                width={400}
                height={400}
                sizes={'(max-width: 1024px) 33vw, 16vw'}
                {...(i < 6 ? { priority: true } : { loading: 'lazy' })} // Исправлено
              />
            </div>
          </div>
        ))}
      </div>

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

export default Galery
