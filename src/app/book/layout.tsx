import type { Metadata } from 'next'

import { Container } from 'components/Container'

import { BookHeader } from './components/BookHeader'
import HideSmartsupp from './components/HiddenChatbox'
import './styles.scss'

const metaTitle = 'Online rezervace | Barbitch Beauty Studio Brno'
const metaDescription =
  'Objednej se online na manikúru, prodloužení řas nebo úpravu obočí v Barbitch Beauty Studiu v Brně. Rychlá a jednoduchá rezervace, profesionální péče a trendy výsledky.'
const metaImage = 'https://barbitch.cz/assets/bigBaner.jpg'
const metaUrl = 'https://barbitch.cz/book'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: metaTitle,
    description: metaDescription,
    keywords: [
      'rezervace online',
      'barbitch rezervace',
      'manikúra Brno',
      'prodloužení řas Brno',
      'úprava obočí Brno',
      'beauty studio Brno',
      'objednat se online',
    ],
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      siteName: 'Barbitch',
      locale: 'cs_CZ',
      images: [{ url: metaImage, width: 1200, height: 630, alt: 'Barbitch Beauty Studio Brno – online rezervace' }],
      url: metaUrl,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: metaTitle,
      description: metaDescription,
      images: [metaImage],
    },
    alternates: {
      canonical: metaUrl,
    },
  }
}

export default async function BookLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
    <style>{`html, body { background-color: #161615; }`}</style>
    <main className={'min-h-screen pb-[100px] pt-[112px] dark-tm'}>
      <Container size={'sm'}>
        <BookHeader />
        {children}
        <HideSmartsupp />
      </Container>
    </main>
    </>
  )
}
