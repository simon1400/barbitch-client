import type { IDataPostShort } from 'fetch/blog'
import type { BlogTopicKey } from 'lib/blogTopic'
import type { Metadata } from 'next'

import { getAllPost, getBlogPage } from 'fetch/blog'
import { getLinkToReserve } from 'fetch/contact'
import { getBlogPageMeta } from 'fetch/getMeta'
import { isOffSeason, postTopic, TOPIC_KEYS, topicKey } from 'lib/blogTopic'
import { jsonLd } from 'lib/jsonLd'
import { cmsTitle, ogImages, SITE_URL } from 'lib/seo'
import Posts from 'sections/Posts'
import { Top } from 'sections/Top/Top'

// Filtr `?tema=` čte searchParams → stránka se vykresluje na požadavek. Seznam článků
// drží datová cache (`getAllPost`, 1 h + tag `blog`), takže Strapi to nezatíží.
export const revalidate = 3600

export async function generateMetadata(): Promise<Metadata> {
  const { metaData } = await getBlogPageMeta()

  return {
    title: cmsTitle(metaData?.title || 'B.B.Blog'),
    description: metaData?.description,
    openGraph: {
      title: metaData.title || 'B.B.Blog',
      description: metaData.description || '',
      siteName: 'Barbitch',
      locale: 'cs_CZ',
      images: ogImages(metaData.image?.url, 'B.B.Blog — Barbitch Brno'),
      url: `https://barbitch.cz/blog`,
      // Výpis článků není článek.
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: metaData.title || 'B.B.Blog',
      description: metaData.description || '',
      images: ogImages(metaData.image?.url, 'B.B.Blog — Barbitch Brno'),
    },
    alternates: {
      canonical: `https://barbitch.cz/blog`,
      // Aby čtečky a agregátory feed našly samy.
      types: {
        'application/rss+xml': [{ url: '/feed.xml', title: 'B.B.Blog — Barbitch Brno' }],
      },
    },
  }
}

/** JSON-LD výpisu: `CollectionPage` se seznamem článků (audit s284). */
const collectionSchema = (title: string, description: string, posts: IDataPostShort[]) => ({
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  '@id': `${SITE_URL}/blog#page`,
  url: `${SITE_URL}/blog`,
  name: title,
  ...(description ? { description } : {}),
  inLanguage: 'cs',
  isPartOf: { '@type': 'WebSite', name: 'Barbitch', url: SITE_URL },
  mainEntity: {
    '@type': 'ItemList',
    itemListElement: posts.map((post, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: `${SITE_URL}/blog/${post.slug}`,
      name: post.title.replaceAll(';sp;', ' '),
    })),
  },
})

const Blog = async ({ searchParams }: { searchParams: Promise<{ tema?: string | string[] }> }) => {
  const [data, posts, dataLink, meta, sp] = await Promise.all([
    getBlogPage(),
    getAllPost(),
    getLinkToReserve(),
    getBlogPageMeta(),
    searchParams,
  ])

  // Jen témata, ke kterým nějaký článek je; neznámé `?tema=` = celý výpis.
  const topics = TOPIC_KEYS.filter((key) => posts.some((post) => postTopic(post) === key))
  const requested = topicKey(Array.isArray(sp?.tema) ? sp.tema[0] : sp?.tema)
  const active: BlogTopicKey | undefined =
    requested && topics.includes(requested) ? requested : undefined
  const visible = active ? posts.filter((post) => postTopic(post) === active) : posts

  // Pořadí drží `getAllPost` (nejnovější podle `blog.date`). Nahoru nejnovější
  // článek, který není sezónní mimo sezónu — jarní manikúra nemá v listopadu svítit.
  const featured = visible.find((post) => !isOffSeason(post))
  const rest = visible.filter((post) => post !== featured)

  return (
    <main>
      <script
        type={'application/ld+json'}
        dangerouslySetInnerHTML={{
          __html: jsonLd(
            collectionSchema(
              meta.metaData?.title || data.title || 'B.B.Blog',
              meta.metaData?.description || '',
              posts,
            ),
          ),
        }}
      />
      <Top title={data.title} small linkToReserve={dataLink.linkToReserve} />
      <section className={'pb-16'}>
        <Posts featured={featured} posts={rest} topics={topics} activeTopic={active} />
      </section>
    </main>
  )
}

export default Blog
