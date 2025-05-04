import { Container } from 'components/Container'

import { BookHeader } from './components/BookHeader'
import HideSmartsupp from './components/HiddenChatbox'

import './styles.scss'

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
