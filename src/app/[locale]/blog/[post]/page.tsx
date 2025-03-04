import type { Metadata } from 'next'

import { DynamicContent } from 'components/DynamicContent'
import { getPost } from 'fetch/blog'
import { getPostMeta } from 'fetch/getMeta'
import { TopImage } from 'sections/Top/TopImage'

export async function generateMetadata({ params }: any): Promise<Metadata> {
  const {post} = params
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
    keywords: ['barbitch', 'bar.bitch', 'bar bitch', 'Brno', 'Blog', title],
    alternates: {
      canonical: `https://barbitch.cz/blog/${post}`,
    },
  }
}

const Post = async ({ params }: any) => {
  const data = await getPost(params.post)

  return (
    <main>
      <TopImage title={data.title} image={data.image} />
      <DynamicContent data={data.dynamicContent} />
    </main>
  )
}

export default Post
