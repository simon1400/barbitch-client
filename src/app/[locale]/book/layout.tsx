import { Container } from 'components/Container'

import { BookHeader } from './components/BookHeader'

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
      </Container>
    </main>
  )
}
