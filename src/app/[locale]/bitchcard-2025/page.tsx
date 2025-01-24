import type { Metadata } from 'next'
import { getBitchCard, getBitchCardMeta } from 'fetch/bitchCard'
import parse from 'html-react-parser'
import { Top } from 'sections/Top'

export async function generateMetadata(): Promise<Metadata> {
  const { title, metaData } = await getBitchCardMeta()

  return {
    title: metaData?.title || title,
    description: metaData?.description,
    openGraph: metaData?.image ? { images: [metaData.image.url] } : null,
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
