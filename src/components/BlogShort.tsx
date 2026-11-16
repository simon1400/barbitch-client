import type { IDataPostShort } from 'fetch/blog'

import Image from 'components/Image'
import { TopicSticker } from 'components/TopicSticker'
import { postDate } from 'fetch/blog'
import { postTopic, TOPIC_LABEL } from 'lib/blogTopic'
import { getStrapiImageUrl } from 'lib/image-utils'
import Link from 'next/link'

const BLUR =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=='

const titleOf = (data: IDataPostShort) => data.title.replaceAll(';sp;', ' ')

const topicLabelOf = (data: IDataPostShort) => {
  const topic = postTopic(data)
  return topic ? TOPIC_LABEL[topic] : ''
}

/** Datum první publikace (s291) — stejný formát jako v článku. */
const PostDate = ({ data, className = '' }: { data: IDataPostShort; className?: string }) => {
  const date = postDate(data)
  if (!date) return null
  return (
    <time dateTime={date} className={className}>
      {new Date(date).toLocaleDateString('cs-CZ', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        timeZone: 'Europe/Prague',
      })}
    </time>
  )
}

const descriptionOf = (data: IDataPostShort) => data.metaData?.description?.trim() || ''

export const BlogBigShort = ({ data }: { data: IDataPostShort }) => {
  const description = descriptionOf(data)

  return (
    <Link href={`/blog/${data.slug}`} className={'w-full relative group mb-56 md:mb-72 block'}>
      <div className={'min-h-[400px] md:min-h-[678px] w-full overflow-hidden'}>
        <Image
          className={
            'w-full h-full object-cover object-center duration-300 grayscale group-hover:grayscale-0'
          }
          fill
          src={getStrapiImageUrl(data.image?.url)}
          alt={data.image?.alternativeText || `Článek: ${titleOf(data)}`}
          // `loading="eager"` samo o sobě obrázek nepředtahuje — bez `priority`
          // nevznikne preload a LCP na /blog čeká na objevení v HTML.
          priority
          quality={75}
          sizes={'(max-width: 768px) 100vw, 954px'}
          placeholder={'blur'}
          blurDataURL={BLUR}
        />
      </div>
      <TopicSticker
        text={topicLabelOf(data)}
        className={
          'absolute left-[18px] top-[18px] px-3.5 py-2 text-[13px] lg:text-[14px] -rotate-3'
        }
      />
      <div
        className={
          'max-w-[954px] w-full -bottom-40 bg-accent text-white absolute py-12 px-10 md:py-16.5 md:px-20'
        }
      >
        <PostDate data={data} className={'block mb-3 text-[14px] font-medium text-white/70'} />
        <h2 className={'text-resBig md:text-xxl'}>
          <span className={'duration-300 group-hover:text-primary'}>
            {titleOf(data)}
            <span className={'text-primary duration-300 ml-3 group-hover:ml-5'}>{'→'}</span>
          </span>
        </h2>
        {!!description && (
          // Na telefonu by deska přerostla rezervu pod fotkou (mb-56) — popis jen od md.
          <p className={'hidden md:block mt-6 text-baseSm text-white/75 line-clamp-2'}>
            {description}
          </p>
        )}
      </div>
    </Link>
  )
}

export const BlogShort = ({ data }: { data: IDataPostShort }) => {
  const topic = topicLabelOf(data)
  const description = descriptionOf(data)

  return (
    <Link href={`/blog/${data.slug}`} className={'w-full relative group block'}>
      <div className={'w-full relative'}>
        <Image
          className={
            'w-full h-auto object-contain object-center duration-300 relative grayscale group-hover:grayscale-0'
          }
          width={500}
          height={500}
          src={getStrapiImageUrl(data.image?.url)}
          alt={data.image?.alternativeText || `Článek: ${titleOf(data)}`}
          loading={'lazy'}
          quality={70}
          sizes={'(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 500px'}
          placeholder={'blur'}
          blurDataURL={BLUR}
        />
        <TopicSticker
          text={topic}
          className={'absolute left-3 top-3 px-3 py-1.5 text-[11px] lg:text-[12px] -rotate-3'}
        />
      </div>
      <div className={'max-w-[954px] w-full bg-accent text-white md:py-10 md:px-12 p-6'}>
        <PostDate data={data} className={'block mb-2 text-[13px] font-medium text-white/70'} />
        <h3 className={'text-h5'}>
          <span className={'duration-300 group-hover:text-primary'}>
            {titleOf(data)}
            <span className={'text-primary duration-300 ml-3 group-hover:ml-5'}>{' →'}</span>
          </span>
        </h3>
        {!!description && (
          <p className={'mt-3 text-[15px] leading-[1.5] text-white/75 line-clamp-2'}>
            {description}
          </p>
        )}
      </div>
    </Link>
  )
}
