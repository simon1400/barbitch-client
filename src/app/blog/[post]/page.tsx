import type { Metadata } from 'next'

import { DynamicContent } from 'components/DynamicContent'
import { getPost } from 'fetch/blog'
import { getPostMeta } from 'fetch/getMeta'
import { Axios } from 'lib/api'
import { getStrapiImageUrl } from 'lib/image-utils'
import { notFound } from 'next/navigation'
import { ArticleSchema } from 'schemasOrg/article'
import { BreadcrumbSchema } from 'schemasOrg/breadcrumb'
import { TopImage } from 'sections/Top/TopImage'

export async function generateStaticParams() {
  const posts = (await Axios.get('/api/blogs?fields[0]=slug')) as { slug: string }[]

  return posts.map((post) => ({
    post: post.slug,
  }))
}

export async function generateMetadata({ params }: any): Promise<Metadata> {
  const { post } = await params
  const data = await getPostMeta(post)

  if (!data) {
    return notFound()
  }

  const { title, metaData } = data

  return {
    title: metaData?.title || title,
    description: metaData?.description,
    openGraph: {
      title: metaData.title || title,
      description: metaData.description || '',
      siteName: 'Barbitch',
      images: [getStrapiImageUrl(metaData.image?.url)],
      url: `https://barbitch.cz/blog/${post}`,
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: metaData.title || title,
      description: metaData.description || '',
      images: [getStrapiImageUrl(metaData.image?.url)],
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

  if (!data) {
    return notFound()
  }

  return (
    <main>
      <BreadcrumbSchema
        items={[
          { name: 'Hlavní strana', url: 'https://barbitch.cz' },
          { name: 'Blog', url: 'https://barbitch.cz/blog' },
          { name: data.title, url: `https://barbitch.cz/blog/${post}` },
        ]}
      />
      <ArticleSchema
        title={data.title}
        description={data.title}
        image={getStrapiImageUrl(data.image?.url)}
        datePublished={data.publishedAt || new Date().toISOString()}
        dateModified={data.updatedAt || new Date().toISOString()}
        url={`https://barbitch.cz/blog/${post}`}
      />
      <TopImage title={data.title} image={data.image} />
      <DynamicContent data={data.dynamicContent} />
    </main>
  )
}

export default Post
