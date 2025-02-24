'use client'
import Image from 'next/image'
import { useState } from 'react'
import Lightbox from 'yet-another-react-lightbox'

import { NextJsImage } from './ImageGalery'
import 'yet-another-react-lightbox/styles.css'

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
            className={
              'relative w-full pt-[100%] overflow-hidden scale-100 hover:scale-95 duration-200'
            }
            key={item.alternativeText || `Some_key_${i}`}
            onClick={() => setIndex(i)}
          >
            <Image
              className={'object-cover absolute w-full h-full top-0 left-0'}
              src={item.url}
              width={400}
              height={400}
              alt={item.alternativeText || 'Image'}
            />
          </div>
        ))}
      </div>
      <Lightbox
        index={index}
        open={index >= 0}
        close={() => setIndex(-1)}
        slides={data.map((item) => ({ src: item.url }))}
        render={{ slide: NextJsImage }}
      />
    </section>
  )
}
