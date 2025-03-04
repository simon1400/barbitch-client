import type { Metadata } from 'next'

import { getAllPost, getBlogPage } from 'fetch/blog'
import { getBlogPageMeta } from 'fetch/getMeta'
import Posts from 'sections/Posts'
import { Top } from 'sections/Top/Top'

export async function generateMetadata(): Promise<Metadata> {
  const { metaData } = await getBlogPageMeta()

  return {
    title: metaData?.title || 'B.B.Blog',
    description: metaData?.description,
    openGraph: {
      title: metaData.title || 'B.B.Blog',
      description: metaData.description || '',
      siteName: 'Barbitch',
      images: [metaData.image ? metaData.image.url : 'https://barbitch.cz/assets/bigBaner.jpg'],
      url: `https://barbitch.cz/blog`,
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: metaData.title || 'B.B.Blog',
      description: metaData.description || '',
      images: [metaData.image ? metaData.image.url : 'https://barbitch.cz/assets/bigBaner.jpg'],
    },
    keywords: ['barbitch', 'bar.bitch', 'bar bitch', 'Brno', 'Blog', 'B.B.Blog'],
    alternates: {
      canonical: `https://barbitch.cz/blog`,
    },
  }
}

const Blog = async () => {
  const data = await getBlogPage()
  const posts = await getAllPost()

  return (
    <main>
      <Top title={data.title} small />
      <section className={'pb-16'}>
        <Posts data={posts} blog />
      </section>
    </main>
  )
}

export default Blog
