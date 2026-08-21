/**
 * Téma článku odvozené ze slugu a titulku.
 *
 * Kolekce `blog` ve Strapi nemá pole kategorie, ale šablona příspěvku potřebuje
 * vědět, na kterou službu odkázat a které články nabídnout jako související.
 * Až kategorie v CMS vznikne, stačí nahradit `topicOf` čtením toho pole.
 */
export type BlogTopic = 'manikura' | 'oboci' | 'rasy'

export const TOPIC_LABEL: Record<BlogTopic, string> = {
  manikura: 'Manikúra',
  oboci: 'Obočí',
  rasy: 'Prodlužování řas',
}

export const TOPIC_CTA: Record<BlogTopic, string> = {
  manikura: 'Chcete manikúru jako z článku? Rezervujte si termín v Barbitch v Brně.',
  oboci: 'Chcete obočí jako z článku? Rezervujte si termín v Barbitch v Brně.',
  rasy: 'Chcete řasy jako z článku? Rezervujte si termín v Barbitch v Brně.',
}

// Porovnává se po tokenech slugu (`-`), ne podřetězcem: jinak by „krásný“
// spadlo pod „řasy“ kvůli sekvenci „ras“.
const TOPIC_MARKERS: Record<BlogTopic, string[]> = {
  manikura: ['manikur', 'nehty', 'nehtu', 'nehet', 'nehtove', 'gel', 'gelove', 'nail'],
  oboci: ['oboci', 'obocim', 'brow'],
  rasy: ['ras', 'rasy', 'rasach', 'rasami', 'lash'],
}

const ORDER: BlogTopic[] = ['rasy', 'oboci', 'manikura']

const normalize = (value: string): string[] =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replaceAll(/[\u0300-\u036F]/g, '')
    .split(/[^a-z0-9]+/)
    .filter(Boolean)

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
