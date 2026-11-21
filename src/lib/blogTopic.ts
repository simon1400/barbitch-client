/**
 * Téma a sezóna článku blogu.
 *
 * Zdroj pravdy jsou pole `blog.topic` a `blog.season` ve Strapi (s291). Dokud je
 * majitelka u článku nevyplní, dopočítá se obojí ze slugu a titulku — stejně
 * jako před s291, takže web funguje i s prázdnými poli.
 */

/** Témata, ke kterým existuje stránka služby `/service/<téma>`. */
export type BlogTopic = 'manikura' | 'oboci' | 'rasy'
/** Všechna témata z enumerace `blog.topic` — `sezona` nemá vlastní službu. */
export type BlogTopicKey = 'sezona' | BlogTopic
export type BlogSeason = 'jaro' | 'podzim' | 'zima'

/** Pořadí v nabídce filtru na /blog. */
export const TOPIC_KEYS: BlogTopicKey[] = ['manikura', 'rasy', 'oboci', 'sezona']

export const TOPIC_LABEL: Record<BlogTopicKey, string> = {
  manikura: 'Manikúra',
  oboci: 'Obočí',
  rasy: 'Řasy',
  sezona: 'Sezóna',
}

export const TOPIC_CTA: Record<BlogTopic, string> = {
  manikura: 'Chcete manikúru jako z článku? Rezervujte si termín v Bar.Bitch v Brně.',
  oboci: 'Chcete obočí jako z článku? Rezervujte si termín v Bar.Bitch v Brně.',
  rasy: 'Chcete řasy jako z článku? Rezervujte si termín v Bar.Bitch v Brně.',
}

export const isServiceTopic = (topic: BlogTopicKey | undefined): topic is BlogTopic =>
  topic === 'manikura' || topic === 'oboci' || topic === 'rasy'

const normalize = (value: string): string[] =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replaceAll(/[\u0300-\u036F]/g, '')
    .split(/[^a-z0-9]+/)
    .filter(Boolean)

// Porovnává se po tokenech slugu (`-`), ne podřetězcem: jinak by „krásný“
// spadlo pod „řasy“ kvůli sekvenci „ras“.
const TOPIC_MARKERS: Record<BlogTopic, string[]> = {
  manikura: ['manikur', 'nehty', 'nehtu', 'nehet', 'nehtove', 'gel', 'gelove', 'nail'],
  oboci: ['oboci', 'obocim', 'brow'],
  rasy: ['ras', 'rasy', 'rasach', 'rasami', 'lash'],
}

const ORDER: BlogTopic[] = ['rasy', 'oboci', 'manikura']

/** Téma odhadnuté ze slugu a titulku — záloha, když `blog.topic` chybí. */
export const topicOf = (slug: string, title = ''): BlogTopic | undefined => {
  const tokens = [...normalize(slug), ...normalize(title)]

  let best: BlogTopic | undefined
  let bestScore = 0

  for (const topic of ORDER) {
    const score = tokens.filter((token) =>
      TOPIC_MARKERS[topic].some((marker) => token.startsWith(marker)),
    ).length

    if (score > bestScore) {
      best = topic
      bestScore = score
    }
  }

  return best
}

/**
 * Hodnota `blog.topic` → klíč. Přijme i starý textový tvar („Manikúra“ z s286):
 * bez diakritiky a velkých písmen je to klíč sám.
 */
export const topicKey = (value: string | null | undefined): BlogTopicKey | undefined => {
  if (!value) return undefined
  const key = normalize(value).join('')
  return (TOPIC_KEYS as string[]).includes(key) ? (key as BlogTopicKey) : undefined
}

interface PostLike {
  slug: string
  title?: string
  topic?: string | null
  season?: string | null
}

/** Téma článku: pole ze Strapi, jinak odhad ze slugu. */
export const postTopic = (post: PostLike): BlogTopicKey | undefined =>
  topicKey(post.topic) ?? topicOf(post.slug, post.title)

const SEASON_MARKERS: Record<BlogSeason, string[]> = {
  jaro: ['jar'],
  podzim: ['podzim', 'halloween'],
  zima: ['zim', 'vanoc', 'vanoce', 'silvestr'],
}

/** Sezóna článku: pole ze Strapi, jinak podle slugu (jarní / podzimní / zimní, vánoční). */
export const postSeason = (post: PostLike): BlogSeason | undefined => {
  const own = post.season
  if (own === 'jaro' || own === 'podzim' || own === 'zima') return own
  const tokens = normalize(post.slug)
  return (Object.keys(SEASON_MARKERS) as BlogSeason[]).find((season) =>
    tokens.some((token) => SEASON_MARKERS[season].some((marker) => token.startsWith(marker))),
  )
}

/** Měsíce sezóny (1–12): jaro 2–5, podzim 8–10, zima 11–1. Červen a červenec nemají žádnou. */
const SEASON_MONTHS: Record<BlogSeason, number[]> = {
  jaro: [2, 3, 4, 5],
  podzim: [8, 9, 10],
  zima: [11, 12, 1],
}

const pragueMonth = (now: Date): number =>
  Number(
    new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Prague', month: 'numeric' }).format(now),
  )

/** Sezónní článek mimo svou sezónu — nenabízet ho jako hlavní ani jako související. */
export const isOffSeason = (post: PostLike, now: Date = new Date()): boolean => {
  const season = postSeason(post)
  return !!season && !SEASON_MONTHS[season].includes(pragueMonth(now))
}
