'use client'

import { motion } from 'motion/react'
import { CldImage } from 'next-cloudinary'
import { useMediaQuery } from 'react-responsive'
import Masonry from 'react-responsive-masonry'

export const MasonryGalery = ({ images }: { images: { name: string; hash: string }[] }) => {
  const mobile = useMediaQuery({
    query: '(max-width: 960px)',
  })

  return (
    <section className={'oveflow-x-hidden'}>
      <motion.div
        initial={{ x: 0 }}
        animate={{
          x: '-66.6%',
          transition: {
            ease: 'linear',
            duration: 130,
            repeat: Infinity,
          },
        }}
        className={`flex ${mobile ? 'gap-3' : 'gap-5'} w-[300%] relative`}
      >
        {[...Array.from({ length: 3 })].map((_, ind) => (
          <Masonry key={ind} gutter={mobile ? '10px' : '20px'} columnsCount={mobile ? 2 : 4}>
            {images.map((item, idx) => (
              <div key={item.name} className={'relative'}>
                <CldImage
                  src={item.hash}
                  width={300}
                  height={400}
                  alt={`Manikura_${idx}_${ind} ${item.name}`}
                />
              </div>
            ))}
          </Masonry>
        ))}
      </motion.div>
    </section>
  )
}
