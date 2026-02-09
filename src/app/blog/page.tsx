import type { Metadata } from 'next'

import { getAllPost, getBlogPage } from 'fetch/blog'
import { getLinkToReserve } from 'fetch/contact'
import { getBlogPageMeta } from 'fetch/getMeta'
import { getStrapiImageUrl } from 'lib/image-utils'
import Posts from 'sections/Posts'
import { Top } from 'sections/Top/Top'

export const dynamic = 'force-static'

export async function generateMetadata(): Promise<Metadata> {
  const { metaData } = await getBlogPageMeta()

  return {
    title: metaData?.title || 'B.B.Blog',
    description: metaData?.description,
    openGraph: {
      title: metaData.title || 'B.B.Blog',
      description: metaData.description || '',
      siteName: 'Barbitch',
      images: [getStrapiImageUrl(metaData.image?.url)],
      url: `https://barbitch.cz/blog`,
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: metaData.title || 'B.B.Blog',
      description: metaData.description || '',
      images: [getStrapiImageUrl(metaData.image?.url)],
    },
    keywords: ['barbitch', 'bar.bitch', 'bar bitch', 'Brno', 'Blog', 'Nehty', 'B.B.Blog'],
    alternates: {
      canonical: `https://barbitch.cz/blog`,
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
        <Posts data={posts.reverse()} blog />
      </section>
    </main>
  )
}

export default Blog
