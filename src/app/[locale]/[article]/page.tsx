import type { Metadata } from 'next'

import { getArticle, getArticleMeta } from 'fetch/article'
import parse from 'html-react-parser'
import { notFound } from 'next/navigation'
import { Top } from 'sections/Top/Top'

// Функция generateMetadata с правильным типом params
export async function generateMetadata({ params }: any): Promise<Metadata> {
  const { article } = params
  const { title, metaData } = await getArticleMeta(article)

  if (!metaData) {
    return notFound()
  }

  return {
    title: metaData?.title || title,
    description: metaData?.description,
    openGraph: {
      title: metaData.title || title,
      description: metaData.description || '',
      siteName: 'Barbitch',
      images: [metaData.image ? metaData.image.url : 'https://barbitch.cz/assets/bigBaner.jpg'],
      url: `https://barbitch.cz/${article}`,
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: metaData.title || title,
      description: metaData.description || '',
      images: [metaData.image ? metaData.image.url : 'https://barbitch.cz/assets/bigBaner.jpg'],
    },
    keywords: ['barbitch', 'bar.bitch', 'bar bitch', 'Brno', title],
    alternates: {
      canonical: `https://barbitch.cz/${article}`,
    },
  }
}

const Article = async ({ params }: any) => {
  const { article } = params
  const data = await getArticle(article)

  if (!data) {
    return notFound()
  }

  return (
    <main>
      <Top title={data.title} small />
      <section className={'pb-16'}>
        <div className={'container mx-auto w-full max-w-[900px] px-4'}>
          <div className={'w-full mb-20 text-xs1 lg:text-base content'}>
            {parse(data.content, { trim: true })}
          </div>
        </div>
      </section>
    </main>
  )
}

export default Article
