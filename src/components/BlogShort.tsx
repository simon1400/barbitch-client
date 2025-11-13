import type { IDataPostShort } from 'fetch/blog'

import parse from 'html-react-parser'
import Image from 'next/image'
import Link from 'next/link'

export const BlogBigShort = ({ data }: { data: IDataPostShort }) => {
  return (
    <Link href={`/blog/${data.slug}`} className={'w-full relative group mb-56 md:mb-72 block'}>
      <div className={'min-h-[400px] md:min-h-[678px] w-full overflow-hidden'}>
        <Image
          className={
            'w-full h-full object-cover object-center duration-300 grayscale group-hover:grayscale-0'
          }
          fill
          src={data.image?.url || '/assets/bigBaner.jpg'}
          alt={data.image?.alternativeText || ''}
          priority
          quality={75}
          sizes={'(max-width: 768px) 100vw, 954px'}
          placeholder={'blur'}
          blurDataURL={
            'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=='
          }
        />
      </div>
      <div
        className={
          'max-w-[954px] w-full -bottom-40 bg-accent text-white absolute py-12 px-10 md:py-16.5 md:px-20'
        }
      >
        <h2 className={'text-resBig md:text-xxl md:mb-7'}>
          <span className={'duration-300 group-hover:text-primary'}>
            {data.title.replaceAll(';sp;', ' ')}
            <span className={'text-primary duration-300 ml-3 group-hover:ml-5'}>{'→'}</span>
          </span>
        </h2>
        <div className={'hidden md:visible text-baseSm md:text-baseText'}>
          {parse(data?.contentText || '', { trim: true })}
        </div>
      </div>
    </Link>
  )
}

export const BlogShort = ({ data }: { data: IDataPostShort }) => {
  return (
    <Link href={`/blog/${data.slug}`} className={'w-full relative group block'}>
      <div className={'w-full'}>
        <Image
          className={
            'w-full h-auto object-contain object-center duration-300 relative grayscale group-hover:grayscale-0'
          }
          width={500}
          height={500}
          src={data.image?.url || '/assets/bigBaner.jpg'}
          alt={data.image?.alternativeText || ''}
          loading={'lazy'}
          quality={70}
          sizes={'(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 500px'}
          placeholder={'blur'}
          blurDataURL={
            'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=='
          }
        />
      </div>
      <div className={'max-w-[954px] w-full bg-accent text-white md:py-10 md:px-12 p-6'}>
        <h3 className={'text-h5'}>
          <span className={'duration-300 group-hover:text-primary'}>
            {data.title.replaceAll(';sp;', ' ')}
            <span className={'text-primary duration-300 ml-3 group-hover:ml-5'}>{' →'}</span>
          </span>
        </h3>
      </div>
    </Link>
  )
}
