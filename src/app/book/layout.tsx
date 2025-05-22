import type { Metadata } from 'next'

import { Container } from 'components/Container'

import { BookHeader } from './components/BookHeader'
import HideSmartsupp from './components/HiddenChatbox'
import './styles.scss'

const metaTitle = 'Rezervace | Barbitch Beauty Studio Brno – Manikúra, řasy, obočí'
const metaDescription =
  'Objednej se online na manikúru, prodloužení řas nebo úpravu obočí v Barbitch Beauty Studiu Brno. Rychlá rezervace, profesionální péče a trendy výsledky.'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: metaTitle,
    description: metaDescription,
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      siteName: 'Barbitch',
      images: ['https://barbitch.cz/assets/bigBaner.jpg'],
      url: `https://barbitch.cz/book`,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: metaTitle,
      description: metaDescription,
      images: ['https://barbitch.cz/assets/bigBaner.jpg'],
    },
    alternates: {
      canonical: `https://barbitch.cz/book`,
    },
  }
}

export default async function BookLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <main className={'min-h-screen pb-[100px] pt-[112px] dark-tm'}>
      <Container size={'sm'}>
        <BookHeader />
        {children}
        <HideSmartsupp />
      </Container>
    </main>
  )
}
