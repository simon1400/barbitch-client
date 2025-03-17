import { Container } from 'components/Container'
import { ChevronLeft } from 'icons/ChevronLeft'

export default async function BookLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <main className={'min-h-screen pb-[100px] pt-[112px] dark-tm'}>
      <Container size={'sm'}>
        <div>
          <a href={'/'} className={'flex items-center gap-3 text-[#A0A0A0] text-resXs mb-5'}>
            <ChevronLeft />
            <span>{'zpět na úvodní stránku'}</span>
          </a>
        </div>
        <div className={'mb-5.5 text-center'}>
          <h1 className={'text-[#FFFFFFBF] text-resLg'}>{'Vyberte službu'}</h1>
        </div>
        {children}
      </Container>
    </main>
  )
}
