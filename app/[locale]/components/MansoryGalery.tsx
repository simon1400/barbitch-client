'use client'

import { useOnMountUnsafe } from 'app/helpers/useOnMountUnsaf'
import { motion } from 'motion/react'
import { useState } from 'react'

import { InfiniteLooper } from './InfiniteLooper'

const images = [
  {
    url: 'https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image.jpg',
  },
  {
    url: 'https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-1.jpg',
  },
  {
    url: 'https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-2.jpg',
  },
  {
    url: 'https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-3.jpg',
  },
  {
    url: 'https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-4.jpg',
  },
  {
    url: 'https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-5.jpg',
  },
  {
    url: 'https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-6.jpg',
  },
  {
    url: 'https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-7.jpg',
  },
  {
    url: 'https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-8.jpg',
  },
  {
    url: 'https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-9.jpg',
  },
  {
    url: 'https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-10.jpg',
  },
  {
    url: 'https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-11.jpg',
  },
]

export const MasonryGalery = () => {
  const [masonryItems, setMasonryItems] = useState([])

  useOnMountUnsafe(() => {
    const splitArrImg: any = []
    const length = images.length / 3
    for (let i = 0; i < length; i++) {
      splitArrImg[i] = images.splice(0, 3)
    }
    setMasonryItems(splitArrImg)
  })

  if (!masonryItems.length) {
    return null
  }

  return (
    <section>
      <InfiniteLooper speed={40} direction={'right'}>
        <div className={'grid grid-cols-2 md:grid-cols-4 gap-4 mx-2'}>
          {masonryItems.map((item, idxParent) => (
            // eslint-disable-next-line react/no-array-index-key, sonarjs/no-array-index-key
            <div key={idxParent} className={'grid gap-4'}>
              {item.map((item: { url: string }) => (
                <motion.div
                  className={'cursor-pointer'}
                  key={item.url}
                  whileHover={{
                    scale: 1.05,
                    transition: { duration: 0.3 },
                  }}
                >
                  <img className={'h-auto max-w-full'} src={item.url} alt={''} />
                </motion.div>
              ))}
            </div>
          ))}
        </div>
      </InfiniteLooper>
    </section>
  )
}
