import type { IDataPostShort } from 'fetch/blog'
import type { BlogTopic } from 'lib/blogTopic'

import { topicOf } from 'lib/blogTopic'
import Link from 'next/link'

import { getStrapiImageUrl } from '../lib/image-utils'

import { Container } from './Container'
import Image from './Image'

/**
 * Tři související články pod příspěvkem.
 *
 * Přednost mají texty ze stejného tématu, zbytek doplní nejnovější — díky tomu
 * blok nezmizí ani u článku, kterému téma přiřadit nejde.
 */
export const RelatedPosts = ({
  posts,
  currentSlug,
  topic,
}: {
  posts: IDataPostShort[]
  currentSlug: string
  topic?: BlogTopic
}) => {
  const others = posts.filter((post) => post.slug !== currentSlug)
  const sameTopic = topic ? others.filter((post) => topicOf(post.slug, post.title) === topic) : []
  const rest = others.filter((post) => !sameTopic.includes(post))
  const related = [...sameTopic, ...rest].slice(0, 3)

  if (related.length === 0) return null

  return (
    <Container size={'xl'}>
      <section className={'mb-16'} aria-labelledby={'souvisejici-clanky'}>
        <h2 id={'souvisejici-clanky'} className={'text-lg lg:text-big uppercase mb-8'}>
          {'Související články'}
        </h2>
        <ul className={'grid gap-6 sm:grid-cols-2 lg:grid-cols-3'}>
          {related.map((post) => (
            <li key={post.slug}>
              <Link className={'group block'} href={`/blog/${post.slug}`}>
                <Image
                  className={
                    'w-full h-[200px] object-cover object-center grayscale duration-300 group-hover:grayscale-0'
                  }
                  src={getStrapiImageUrl(post.image?.url)}
                  alt={post.image?.alternativeText || post.title.replaceAll(';sp;', ' ')}
                  width={400}
                  height={200}
                  loading={'lazy'}
                  quality={70}
                  sizes={'(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px'}
                />
                <h3 className={'text-baseText mt-3 duration-300 group-hover:text-primary'}>
                  {post.title.replaceAll(';sp;', ' ')}
                </h3>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </Container>
  )
}
