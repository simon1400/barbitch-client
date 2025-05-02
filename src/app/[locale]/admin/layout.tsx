import { Container } from 'components/Container'
import { Top } from 'sections/Top/Top'

// import { Sidebar } from './Sidebar'

export default async function AdminLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode
  params: Promise<{ locale: string }>
}>) {
  return (
    <div id={'layout-admin-page'}>
      <Top title={'Admin'} small linkToReserve={'/book'} />
      <Container size={'xl'}>
        <div className={'md:flex'}>
          {/* <Sidebar /> */}
          <main className={'w-full'}>{children}</main>
        </div>
      </Container>
    </div>
  )
}
