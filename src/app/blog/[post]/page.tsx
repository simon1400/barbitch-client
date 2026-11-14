import type { Metadata } from 'next'

import { Breadcrumbs } from 'components/Breadcrumbs'
import { Container } from 'components/Container'
import { DynamicContent } from 'components/DynamicContent'
import { PostCta } from 'components/PostCta'
import { RelatedPosts } from 'components/RelatedPosts'
import { getAllPost, getPost } from 'fetch/blog'
import { Axios } from 'lib/api'
import { TOPIC_LABEL, topicOf } from 'lib/blogTopic'
import { getStrapiImageUrl } from 'lib/image-utils'
import { relatedPostsOf } from 'lib/relatedPosts'
import { cmsTitle, ogImages } from 'lib/seo'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArticleSchema } from 'schemasOrg/article'
import { TopImage } from 'sections/Top/TopImage'

// Bez toho se stránka vygeneruje jednou při buildu a v Strapi upravený text
// se na produkci neobjeví až do dalšího nasazení (prod vracel s-maxage=31536000).
export const revalidate = 3600

export async function generateStaticParams() {
  try {
    const posts = (await Axios.get('/api/blogs?fields[0]=slug')) as {
      slug: string
    }[]

    return posts.map((post) => ({
      post: post.slug,
    }))
  } catch (error) {
    // Výpadek CMS nesmí shodit celý build — chybějící cesty se dogenerují na vyžádání.
    console.error('Failed to fetch blog slugs for static params:', error)
    return []
  }
}

export async function generateMetadata({ params }: any): Promise<Metadata> {
  const { post } = await params
  const data = await getPost(post)

  if (!data) {
    // Neexistující slug končí `notFound()` — metadata to musí potvrdit,
    // jinak 404 zdědí `index: true` z rootu.
    return {
      title: { absolute: 'Příspěvek nenalezen (404) | Barbitch' },
      description: '',
      robots: { index: false, follow: false },
    }
  }

  const { title, metaData } = data

  return {
    title: cmsTitle(metaData?.title || title),
    description: metaData?.description,
    openGraph: {
      title: metaData?.title || title,
      description: metaData?.description || '',
      siteName: 'Barbitch',
      // `openGraph` z layoutu se do stránky nedědí po polích — `locale` je nutné
      // zopakovat, jinak z 24 stránek zmizí na 21.
      locale: 'cs_CZ',
      images: ogImages(metaData?.image?.url, `${title} — Barbitch Brno`),
      url: `https://barbitch.cz/blog/${post}`,
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: metaData?.title || title,
      description: metaData?.description || '',
      images: ogImages(metaData?.image?.url, `${title} — Barbitch Brno`),
    },
    alternates: {
      canonical: `https://barbitch.cz/blog/${post}`,
    },
  }
}

// 1 × 12 px uprostřed mezery před položkou: 14 px + čára + 14 px jako v návrhu (gap-x-[29px]).
const SEPARATOR = 'absolute -left-[15px] top-1/2 h-3 w-px -translate-y-1/2 bg-[#1616154D]'

const Post = async ({ params }: any) => {
  const { post } = await params
  const [data, allPosts] = await Promise.all([getPost(post), getAllPost()])

  if (!data) {
    return notFound()
  }

  const cleanTitle = data.title.replaceAll(';sp;', ' ')
  const topic = topicOf(post, cleanTitle)
  const published = data.publishedAt
  // Stejný výběr jako „Související články“ — první z nich.
  const [nextPost] = relatedPostsOf(allPosts, post, topic, 1)

  return (
    <main>
      <ArticleSchema
        title={cleanTitle}
        description={data.metaData?.description || cleanTitle}
        image={getStrapiImageUrl(data.image?.url)}
        datePublished={published}
        dateModified={data.updatedAt}
        url={`https://barbitch.cz/blog/${post}`}
      />
      <article>
        <TopImage title={data.title} image={data.image} noMargin />
        <Breadcrumbs
          items={[
            { name: 'Hlavní strana', url: 'https://barbitch.cz' },
            { name: 'Blog', url: 'https://barbitch.cz/blog' },
            { name: cleanTitle, url: `https://barbitch.cz/blog/${post}` },
          ]}
          back={{ label: 'Zpět na blog', url: 'https://barbitch.cz/blog' }}
          next={
            nextPost
              ? {
                  prefix: 'Další článek:',
                  label: nextPost.title.replaceAll(';sp;', ' '),
                  url: `https://barbitch.cz/blog/${nextPost.slug}`,
                }
              : undefined
          }
        />
        {!!published && (
          // Stejná šířka jako blok Text (Container lg) — řádek začíná na svislici textu článku.
          <Container size={'lg'}>
            <p className={'mb-8 border-b border-[#16161524] pb-4'}>
              {/* Oddělovač patří k položce za ním a stojí v mezeře vlevo od ní. Když se položka
                  zalomí na začátek řádku, oddělovač vyjede za levý okraj a overflow-hidden ho
                  ořízne — na telefonu tak „|“ nevisí na konci prvního řádku. px-1/-mx-1 nechává
                  místo pro focus ring odkazu. */}
              <span
                className={
                  '-mx-1 flex flex-wrap items-center gap-x-[29px] gap-y-1.5 overflow-hidden px-1 text-[13px] font-medium text-[#5f5f5e] md:text-[14px]'
                }
              >
                <time dateTime={published} className={'text-accent'}>
                  {new Date(published).toLocaleDateString('cs-CZ', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </time>
                {topic && (
                  <span className={'relative'}>
                    <span aria-hidden={'true'} className={SEPARATOR} />
                    <Link
                      href={`/service/${topic}`}
                      className={
                        'text-[#5f5f5e] underline decoration-[#1616154D] underline-offset-4 hover:text-primary'
                      }
                    >
                      {TOPIC_LABEL[topic]}
                    </Link>
                  </span>
                )}
                <span className={'relative'}>
                  <span aria-hidden={'true'} className={SEPARATOR} />
                  {'Barbitch Beauty Studio'}
                </span>
              </span>
            </p>
          </Container>
        )}
        <DynamicContent data={data.dynamicContent} />
      </article>
      <PostCta topic={topic} />
      <RelatedPosts posts={allPosts} currentSlug={post} topic={topic} />
    </main>
  )
}

export default Post
