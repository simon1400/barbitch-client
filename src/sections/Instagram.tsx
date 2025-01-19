'use client'
import { useOnMountUnsafe } from 'helpers/useOnMountUnsaf'
import { InstaBaseIcon } from 'icons/InstaBase'
import { ReelsIcon } from 'icons/Reels'
// import Image from 'next/image'
import { useState } from 'react'

export const Instagram = ({ data }: { data: IInstagramItem[] }) => {
  const [images, setImages] = useState<IInstagramItem[]>([])

  useOnMountUnsafe(() => {
    setImages(data.splice(0, 6))
  })
  return (
    <section>
      <h2 className={'text-lg lg:text-big uppercase mt-10 lg:mt-20 text-center -mb-1'}>
        {'Follow'}
      </h2>
      <div className={'grid grid-cols-3 lg:grid-cols-6 grid-rows-2 lg:grid-rows-1 gap-1'}>
        {images.map((item) => (
          <a
            href={item.link}
            target={'_blank'}
            className={
              'block relative w-full pt-[100%] overflow-hidden scale-100 hover:scale-95 duration-200'
            }
            key={item.link}
          >
            <span className={'absolute top-2 right-2 z-20 w-6 fill-white'}>
              {item.type === 'VIDEO' ? <ReelsIcon /> : <InstaBaseIcon />}
            </span>
            <img
              className={'object-cover absolute w-full h-full top-0 left-0'}
              src={item.previewUrl}
              width={400}
              height={400}
              alt={item.caption}
            />
          </a>
        ))}
      </div>
    </section>
  )
}
