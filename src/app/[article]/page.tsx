import type { Metadata } from 'next'

import { DynamicContent } from 'components/DynamicContent'
import { getArticle, getArticleMeta } from 'fetch/article'
import { getLinkToReserve } from 'fetch/contact'
import { Axios } from 'lib/api'
import { notFound } from 'next/navigation'
import { Top } from 'sections/Top/Top'

export async function generateStaticParams() {
  const articles = (await Axios.get('/api/articles?fields[0]=slug')) as { slug: string }[]

  return articles.map((article) => ({
    article: article.slug,
  }))
}

export async function generateMetadata({ params }: any): Promise<Metadata> {
  const { article } = await params
  const data = await getArticleMeta(article)

  if (!data) {
    return notFound()
  }

  const { title, metaData } = data

  return {
    title: metaData?.title || title,
    description: metaData?.description,
    openGraph: {
      title: metaData?.title || title,
      description: metaData?.description || '',
      siteName: 'Barbitch',
      images: [metaData?.image ? metaData.image.url : 'https://barbitch.cz/assets/bigBaner.jpg'],
      url: `https://barbitch.cz/${article}`,
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: metaData?.title || title,
      description: metaData?.description || '',
      images: [metaData?.image ? metaData.image.url : 'https://barbitch.cz/assets/bigBaner.jpg'],
    },
    keywords: ['barbitch', 'bar.bitch', 'bar bitch', 'Brno', 'Nehty', title],
    alternates: {
      canonical: `https://barbitch.cz/${article}`,
    },
  }
}

const Article = async ({ params }: any) => {
  const { article } = await params
  const data = await getArticle(article)
  const dataLink = await getLinkToReserve()

  if (!data) {
    return notFound()
  }

  return (
    <main>
      <Top title={data.title} small linkToReserve={dataLink.linkToReserve} />
      <DynamicContent data={data.dynamicContent} />
    </main>
  )
}

export default Article
