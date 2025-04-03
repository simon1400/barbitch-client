import { Container } from 'components/Container'
import { Top } from 'sections/Top/Top'

export default async function AdminLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode
  params: Promise<{ locale: string }>
}>) {
  return (
    <div id={'layout-page'}>
      <Top title={'Admin'} small linkToReserve={'/'} />
      <Container size={'xl'}>
        <div className={'md:flex'}>
          <aside className={'min-w-[200px] max-w-[300px] w-full'}>
            <nav>
              <ul>
                <li>
                  <a href={'/admin'}>{'Moje prace'}</a>
                </li>
                <li>
                  <a href={'/admin/stats'}>{'Statictika'}</a>
                </li>
              </ul>
            </nav>
          </aside>
          <main className={'w-full'}>{children}</main>
        </div>
      </Container>
    </div>
  )
}
