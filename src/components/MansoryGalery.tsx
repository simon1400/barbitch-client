'use client'

import { motion } from 'motion/react'
import { useMediaQuery } from 'react-responsive'
import Masonry from 'react-responsive-masonry'

const APP_API = process.env.APP_API

export const MasonryGalery = ({ images }: { images: { name: string; url: string }[] }) => {
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
            {images.map((item) => (
              <div key={item.name} className={'relative'}>
                <img src={APP_API + item.url} alt={'asd'} />
              </div>
            ))}
          </Masonry>
        ))}
      </motion.div>
    </section>
  )
}
