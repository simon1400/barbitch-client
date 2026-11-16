import type { IDataPostShort } from 'fetch/blog'
import type { BlogTopicKey } from 'lib/blogTopic'

import { BlogBigShort, BlogShort } from 'components/BlogShort'
import { Container } from 'components/Container'
import { TOPIC_LABEL } from 'lib/blogTopic'
import Link from 'next/link'

import { MasonryGrid } from './Masonry/MasonryGrid'

const pill = (active: boolean) =>
  `inline-block px-3 py-2 text-[13px] md:px-4 md:text-[14px] font-bold uppercase tracking-[1px] border border-accent duration-300 ${
    active
      ? 'bg-accent text-white hover:text-white'
      : 'text-accent hover:bg-accent hover:text-white'
  }`

/**
 * Filtr podle tématu (s291): obyčejné odkazy `?tema=` — vykreslí server, bez
 * klientského stavu. Canonical zůstává `/blog` (nastavuje stránka).
 */
const TopicFilter = ({ topics, active }: { topics: BlogTopicKey[]; active?: BlogTopicKey }) => (
  <nav aria-label={'Témata článků'} className={'mb-10 md:mb-14'}>
    <ul className={'flex flex-wrap gap-2.5'}>
      <li>
        <Link href={'/blog'} className={pill(!active)} aria-current={active ? undefined : 'page'}>
          {'Vše'}
        </Link>
      </li>
      {topics.map((topic) => (
        <li key={topic}>
          <Link
            href={`/blog?tema=${topic}`}
            className={pill(active === topic)}
            aria-current={active === topic ? 'page' : undefined}
          >
            {TOPIC_LABEL[topic]}
          </Link>
        </li>
      ))}
    </ul>
  </nav>
)

/**
 * Výpis /blog: nahoře velký článek (nejnovější, který není sezónní mimo sezónu),
 * pod ním ostatní v pořadí podle data — sezónní tu zůstávají i mimo sezónu
 * (vnitřní odkazy drží jejich pozice ve vyhledávání).
 */
const Posts = ({
  featured,
  posts,
  topics,
  activeTopic,
}: {
  featured?: IDataPostShort
  posts: IDataPostShort[]
  topics: BlogTopicKey[]
  activeTopic?: BlogTopicKey
}) => (
  <Container size={'xl'}>
    {topics.length > 1 && <TopicFilter topics={topics} active={activeTopic} />}
    {!!featured && <BlogBigShort data={featured} />}
    {posts.length > 0 && (
      <>
        <h2 className={'text-resTop md:text-xxl mb-12 md:mb-17.5 text-center'}>
          {featured ? 'STARŠÍ PŘÍSPĚVKY' : 'PŘÍSPĚVKY'}
        </h2>
        <div>
          <MasonryGrid sm={1}>
            {posts.map((item: IDataPostShort) => (
              <BlogShort key={item.slug} data={item} />
            ))}
          </MasonryGrid>
        </div>
      </>
    )}
  </Container>
)

export default Posts
