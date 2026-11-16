import type { IDataPostShort } from 'fetch/blog'
import type { BlogTopicKey } from 'lib/blogTopic'

import { isOffSeason, postTopic } from 'lib/blogTopic'

/**
 * Související články k příspěvku (s291): nejdřív stejné téma, pak ostatní — v obou
 * skupinách nejnovější první podle `blog.date` (pořadí drží `getAllPost`). Sezónní
 * článek mimo svou sezónu se nenabízí: pod zimní manikúrou nemá stát jarní.
 *
 * Sdílí ho `RelatedPosts` i „Další článek“ v drobečkové navigaci, aby oba
 * ukazovaly na stejný text.
 */
export const relatedPostsOf = (
  posts: IDataPostShort[],
  currentSlug: string,
  topic?: BlogTopicKey,
  limit = 3,
  now: Date = new Date(),
): IDataPostShort[] => {
  const others = posts.filter((post) => post.slug !== currentSlug && !isOffSeason(post, now))
  const sameTopic = topic ? others.filter((post) => postTopic(post) === topic) : []
  const rest = others.filter((post) => !sameTopic.includes(post))
  return [...sameTopic, ...rest].slice(0, limit)
}
