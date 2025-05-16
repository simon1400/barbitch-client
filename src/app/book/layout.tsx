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
    keywords: [
      'barbitch',
      'bar.bitch',
      'Kontakt',
      'Brno',
      'Rezervace',
      'Manikúra',
      'Nehty',
      'Prodlužování řas',
      'Úprava obočí',
      'rezervace Barbitch',
      'rezervace manikúra Brno',
      'objednat se na řasy v Brně',
      'objednat se na obočí Brno',
      'online rezervace beauty studia',
      'rezervace manikúra Brno',
      'objednání na prodloužení řas Brno',
      'rezervace na úpravu obočí Brno',
      'beauty salon Brno online',
      'objednat se ke kosmetičce v Brně',
      'rezervace na beauty péči Brno',
      'nail salon Brno booking',
      'lash extensions Brno appointment',
    ],
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
