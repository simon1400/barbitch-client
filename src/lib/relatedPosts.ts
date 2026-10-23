import type { IDataPostShort } from 'fetch/blog'
import type { BlogTopic } from 'lib/blogTopic'

import { topicOf } from 'lib/blogTopic'

/**
 * Související články k příspěvku: nejdřív stejné téma, zbytek doplní nejnovější.
 *
 * Sdílí ho `RelatedPosts` i „Další článek“ v drobečkové navigaci, aby oba
 * ukazovaly na stejný text.
 */
export const relatedPostsOf = (
  posts: IDataPostShort[],
  currentSlug: string,
  topic?: BlogTopic,
  limit = 3,
): IDataPostShort[] => {
  const others = posts.filter((post) => post.slug !== currentSlug)
  const sameTopic = topic ? others.filter((post) => topicOf(post.slug, post.title) === topic) : []
  const rest = others.filter((post) => !sameTopic.includes(post))
  return [...sameTopic, ...rest].slice(0, limit)
}
