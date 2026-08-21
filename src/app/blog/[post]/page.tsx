import type { Metadata } from 'next'

import { Breadcrumbs } from 'components/Breadcrumbs'
import { Container } from 'components/Container'
import { DynamicContent } from 'components/DynamicContent'
import { PostCta } from 'components/PostCta'
import { RelatedPosts } from 'components/RelatedPosts'
import { getAllPost, getPost } from 'fetch/blog'
import { Axios } from 'lib/api'
import { topicOf } from 'lib/blogTopic'
import { getStrapiImageUrl } from 'lib/image-utils'
import { cmsTitle, ogImages } from 'lib/seo'
import { notFound } from 'next/navigation'
import { ArticleSchema } from 'schemasOrg/article'
import { TopImage } from 'sections/Top/TopImage'

// Bez toho se stránka vygeneruje jednou při buildu a v Strapi upravený text
// se na produkci neobjeví až do dalšího nasazení (prod vracel s-maxage=31536000).
export const revalidate = 3600

export async function generateStaticParams() {
  try {
    const posts = (await Axios.get('/api/blogs?fields[0]=slug')) as { slug: string }[]

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

const Post = async ({ params }: any) => {
  const { post } = await params
  const [data, allPosts] = await Promise.all([getPost(post), getAllPost()])

  if (!data) {
    return notFound()
  }

  const cleanTitle = data.title.replaceAll(';sp;', ' ')
  const topic = topicOf(post, cleanTitle)
  const published = data.publishedAt

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
        <TopImage title={data.title} image={data.image} />
        <Breadcrumbs
          items={[
            { name: 'Hlavní strana', url: 'https://barbitch.cz' },
            { name: 'Blog', url: 'https://barbitch.cz/blog' },
            { name: cleanTitle, url: `https://barbitch.cz/blog/${post}` },
          ]}
        />
        {!!published && (
          <Container size={'xl'}>
            {/* Datum a autor byly jen ve strukturovaných datech — čtenář je neviděl. */}
            <p className={'text-baseSm text-[#767676] pb-6'}>
              {'Publikováno '}
              <time dateTime={published}>
                {new Date(published).toLocaleDateString('cs-CZ', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </time>
              {' · Barbitch Beauty Studio'}
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
