import type { Metadata } from 'next'

import { DynamicContent } from 'components/DynamicContent'
import { getPost } from 'fetch/blog'
import { getBlogPageMeta } from 'fetch/getMeta'
import { TopImage } from 'sections/Top/TopImage'

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

const Post = async ({ params }: { params: { post: string } }) => {
  const data = await getPost(params.post)
  console.log(data.dynamicContent)

  return (
    <main>
      <TopImage title={data.title} />
      <DynamicContent data={data.dynamicContent} />
    </main>
  )
}

export default Post
