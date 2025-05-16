import type { Metadata } from 'next'

import { DynamicContent } from 'components/DynamicContent'
import { getPost } from 'fetch/blog'
import { getPostMeta } from 'fetch/getMeta'
import { TopImage } from 'sections/Top/TopImage'

export async function generateMetadata({ params }: any): Promise<Metadata> {
  const { post } = await params
  const { title, metaData } = await getPostMeta(post)

  return {
    title: metaData?.title || title,
    description: metaData?.description,
    openGraph: {
      title: metaData.title || title,
      description: metaData.description || '',
      siteName: 'Barbitch',
      images: [metaData.image ? metaData.image.url : 'https://barbitch.cz/assets/bigBaner.jpg'],
      url: `https://barbitch.cz/blog/${post}`,
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: metaData.title || title,
      description: metaData.description || '',
      images: [metaData.image ? metaData.image.url : 'https://barbitch.cz/assets/bigBaner.jpg'],
    },
    keywords: ['barbitch', 'bar.bitch', 'bar bitch', 'Brno', 'Nehty', 'Blog', title],
    alternates: {
      canonical: `https://barbitch.cz/blog/${post}`,
    },
  }
}

const Post = async ({ params }: any) => {
  const { post } = await params
  const data = await getPost(post)

  return (
    <main>
      <TopImage title={data.title} image={data.image} />
      <DynamicContent data={data.dynamicContent} />
    </main>
  )
}

export default Post
