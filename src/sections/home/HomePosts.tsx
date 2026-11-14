import type { IDataPostShort } from 'fetch/blog'

import Image from 'components/Image'
import { TOPIC_LABEL, topicOf } from 'lib/blogTopic'
import Link from 'next/link'

import { SECTION_Y, SectionTitle, TextLink, WRAP } from './ui'

/** Nálepka tématu: ruční `blog.topic`, jinak odvozené ze slugu (lib/blogTopic). */
const topicLabel = (post: IDataPostShort) => {
  const own = post.topic?.trim()
  if (own) return own
  const auto = topicOf(post.slug, post.title)
  return auto ? TOPIC_LABEL[auto] : ''
}

const Sticker = ({ text, className = '' }: { text: string; className?: string }) =>
  text ? (
    <span
      className={`inline-block bg-[#ff6aa0] text-accent font-extrabold uppercase tracking-[1px] ${className}`}
    >
      {text}
    </span>
  ) : null

/**
 * B.B.Blog na hlavní stránce (s286): vlevo velký článek (č/b fotka 16:10, černá
 * deska s nadpisem přes fotku), vpravo dva menší. Hover — fotka zbarví.
 * Stránka /blog dál používá `sections/Posts`.
 */
const HomePosts = ({ posts }: { posts: IDataPostShort[] }) => {
  const [big, ...small] = posts.filter((p) => p?.slug && p?.title)
  if (!big) return null

  return (
    <section aria-labelledby={'bb-blog'} className={`bg-white ${SECTION_Y}`}>
      <div className={`${WRAP} flex flex-col gap-8 lg:gap-11`}>
        <div className={'flex flex-wrap items-end justify-between gap-3'}>
          <SectionTitle id={'bb-blog'}>{'B.B.Blog'}</SectionTitle>
          <TextLink href={'/blog'}>{'Všechny články'}</TextLink>
        </div>

        <div className={'flex flex-wrap gap-8 lg:gap-12'}>
          <Link
            href={`/blog/${big.slug}`}
            className={
              'group relative flex-[1.6_1_560px] min-w-0 block lg:pb-[90px] text-white hover:text-white no-underline'
            }
          >
            <span className={'relative block w-full aspect-[16/10] overflow-hidden bg-accent'}>
              {big.image?.url && (
                <Image
                  src={big.image.url}
                  alt={big.image.alternativeText || `Článek: ${big.title}`}
                  fill
                  sizes={'(min-width: 1024px) 55vw, 100vw'}
                  loading={'lazy'}
                  className={
                    'object-cover grayscale group-hover:grayscale-0 group-focus-visible:grayscale-0 [transition-property:filter] [transition-duration:400ms]'
                  }
                />
              )}
            </span>
            <Sticker
              text={topicLabel(big)}
              className={
                'absolute left-[18px] top-[18px] px-3.5 py-2 text-[13px] lg:text-[14px] -rotate-3'
              }
            />
            <span
              className={
                'block lg:absolute lg:left-0 lg:bottom-0 lg:w-[78%] box-border px-5 py-6 lg:px-10 lg:py-9 bg-accent'
              }
            >
              <h3
                className={'m-0 text-[20px] lg:text-[30px] leading-[1.2] font-extrabold text-white'}
              >
                {big.title}{' '}
                <span aria-hidden={'true'} className={'text-[#ff5c96]'}>
                  {'→'}
                </span>
              </h3>
            </span>
          </Link>

          {small.length > 0 && (
            <div className={'flex-[1_1_380px] min-w-0 flex flex-col justify-center gap-6 lg:gap-9'}>
              {small.slice(0, 2).map((post) => {
                const topic = topicLabel(post)
                return (
                  <Link
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    className={
                      'group flex gap-4 lg:gap-5 text-accent hover:text-accent no-underline'
                    }
                  >
                    <span
                      className={
                        'relative block shrink-0 w-24 h-24 lg:w-[180px] lg:h-[180px] overflow-hidden bg-accent'
                      }
                    >
                      {post.image?.url && (
                        <Image
                          src={post.image.url}
                          alt={post.image.alternativeText || `Článek: ${post.title}`}
                          fill
                          sizes={'(min-width: 1024px) 180px, 96px'}
                          loading={'lazy'}
                          className={
                            'object-cover grayscale group-hover:grayscale-0 group-focus-visible:grayscale-0 [transition-property:filter] [transition-duration:400ms]'
                          }
                        />
                      )}
                    </span>
                    <span className={'flex flex-col justify-center gap-2.5 min-w-0'}>
                      <Sticker
                        text={topic}
                        className={'self-start px-3 py-1.5 text-[11px] lg:text-[13px]'}
                      />
                      <h3
                        className={
                          'm-0 text-[15px] lg:text-[21px] leading-[1.3] font-extrabold group-hover:underline'
                        }
                      >
                        {post.title}
                      </h3>
                    </span>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default HomePosts
