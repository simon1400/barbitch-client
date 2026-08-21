import type { Metadata } from 'next'

import { getAllPost, getBlogPage } from 'fetch/blog'
import { getLinkToReserve } from 'fetch/contact'
import { getBlogPageMeta } from 'fetch/getMeta'
import { cmsTitle, ogImages } from 'lib/seo'
import Posts from 'sections/Posts'
import { Top } from 'sections/Top/Top'

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

const Blog = async () => {
  const [data, posts, dataLink] = await Promise.all([
    getBlogPage(),
    getAllPost(),
    getLinkToReserve(),
  ])

  return (
    <main>
      <Top title={data.title} small linkToReserve={dataLink.linkToReserve} />
      <section className={'pb-16'}>
        {/* Pořadí řeší `sort` v dotazu (nejnovější první) — `reverse()` navíc
            mutoval pole a spoléhal na výchozí pořadí ze Strapi. */}
        <Posts data={posts} blog />
      </section>
    </main>
  )
}

export default Blog
