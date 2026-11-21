import type { IDataPostShort } from 'fetch/blog'
import type { BlogTopicKey } from 'lib/blogTopic'

import { BlogBigShort, BlogShort } from 'components/BlogShort'
import { Container } from 'components/Container'
import { isOffSeason, postTopic, TOPIC_LABEL } from 'lib/blogTopic'

import { PostsFilter } from './PostsFilter'

/** Velký článek nahoře: nejnovější, který není sezónní mimo sezónu. */
const pickFeatured = (posts: IDataPostShort[]) => posts.find((post) => !isOffSeason(post))

/**
 * Výpis /blog: nahoře velký článek (nejnovější, který není sezónní mimo sezónu),
 * pod ním ostatní v pořadí podle data — sezónní tu zůstávají i mimo sezónu
 * (vnitřní odkazy drží jejich pozice ve vyhledávání).
 *
 * Karty vykreslí server; filtr podle tématu (`?tema=`) jen vybírá, které ukázat
 * (s303). Dřív stránka četla `searchParams`, byla dynamická a Next posílal
 * <title> a canonical až v <body>. V HTML je vždy celý výpis (bez filtru).
 */
const Posts = ({ posts, topics }: { posts: IDataPostShort[]; topics: BlogTopicKey[] }) => {
  const featured: Record<string, { slug: string; node: React.ReactNode }> = {}
  for (const key of ['', ...topics]) {
    const post = pickFeatured(key ? posts.filter((p) => postTopic(p) === key) : posts)
    if (post) featured[key] = { slug: post.slug, node: <BlogBigShort data={post} /> }
  }

  return (
    <Container size={'xl'}>
      <PostsFilter
        topics={topics.map((key) => ({ key, label: TOPIC_LABEL[key] }))}
        featured={featured}
        cards={posts.map((post) => ({
          slug: post.slug,
          topic: postTopic(post) ?? '',
          node: <BlogShort data={post} />,
        }))}
      />
    </Container>
  )
}

export default Posts
