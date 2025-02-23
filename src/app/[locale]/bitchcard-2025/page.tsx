import type { Metadata } from 'next'

import { getBitchCard, getBitchCardMeta } from 'fetch/bitchCard'
import parse from 'html-react-parser'
import { Top } from 'sections/Top'

export async function generateMetadata(): Promise<Metadata> {
  const { title, metaData } = await getBitchCardMeta()

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

const BitchCard = async () => {
  const data = await getBitchCard()

  return (
    <main>
      <Top title={data.title} small />
      <section className={'pt-20 pb-16'}>
        <div className={'container mx-auto w-full max-w-[900px] px-4'}>
          <div className={'w-full mb-20 text-xs1 lg:text-base content'}>
            {parse(data.contentText, { trim: true })}
          </div>
        </div>
      </section>
    </main>
  )
}

export default BitchCard
