'use client'

import { motion } from 'motion/react'
import { CldImage } from 'next-cloudinary'
import { useEffect, useState } from 'react'
import Masonry from 'react-responsive-masonry'

interface Image {
  name: string
  hash: string
}

interface MasonryGalleryProps {
  images: Image[]
}

export const MasonryGalery = ({ images }: MasonryGalleryProps) => {
  const [isMobile, setIsMobile] = useState(false) // Дефолтное состояние

  useEffect(() => {
    // Проверяем ширину экрана на клиенте
    const handleResize = () => {
      setIsMobile(window.matchMedia('(max-width: 960px)').matches)
    }

    handleResize() // Устанавливаем начальное значение
    window.addEventListener('resize', handleResize) // Слушаем изменение размера экрана

    return () => window.removeEventListener('resize', handleResize) // Удаляем обработчик
  }, [])

  const gap = isMobile ? '10px' : '20px' // Отступы между изображениями
  const columns = isMobile ? 2 : 4 // Количество колонок

  return (
    <section className={'overflow-x-hidden'} aria-labelledby={'masonry-gallery'}>
      {/* Скрытый заголовок для доступности */}
      <h2 id={'masonry-gallery'} className={'sr-only'}>
        {'Masonry Gallery'}
      </h2>
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
        className={`flex gap-${isMobile ? '3' : '5'} w-[300%] relative`}
      >
        {/* Повторяющаяся галерея */}
        {[...Array.from({ length: 3 })].map((_, index) => (
          <Masonry key={index} gutter={gap} columnsCount={columns}>
            {images.map((image, idx) => (
              <div key={`${image.hash}-${idx}`} className={'relative'}>
                <CldImage
                  src={image.hash}
                  width={300}
                  height={400}
                  alt={`Obrázek ${idx + 1} z galerie: ${image.name}`}
                  loading={'lazy'} // Lazy loading для производительности
                />
              </div>
            ))}
          </Masonry>
        ))}
      </motion.div>
    </section>
  )
}
