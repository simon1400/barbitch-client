import type { Metadata } from 'next'

import { getArticle, getArticleMeta } from 'fetch/article'
import parse from 'html-react-parser'
import { Top } from 'sections/Top/Top'

export async function generateMetadata({ params }: any): Promise<Metadata> {
  const { slug } = params
  const { title, metaData } = await getArticleMeta(slug)

  return {
    title: metaData?.title || title,
    description: metaData?.description,
    openGraph: {
      title: metaData.title || title,
      description: metaData.description || '',
      siteName: 'Barbitch',
      images: [metaData.image ? metaData.image.url : 'https://barbitch.cz/assets/bigBaner.jpg'],
      url: `https://barbitch.cz/bitchcard-2025`,
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: metaData.title || title,
      description: metaData.description || '',
      images: [metaData.image ? metaData.image.url : 'https://barbitch.cz/assets/bigBaner.jpg'],
    },
    keywords: ['barbitch', 'bar.bitch', 'bar bitch', 'Brno', 'Bitchcard'],
    alternates: {
      canonical: `https://barbitch.cz/bitchcard-2025`,
    },
  }
}

const BitchCard = async ({ params }: { params: { article: string } }) => {
  const data = await getArticle(params.article as string)

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

export default BitchCard
