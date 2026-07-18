import type { Metadata } from 'next'

import { Container } from 'components/Container'

import { VerifyClient } from './VerifyClient'

export const metadata: Metadata = {
  title: 'Přihlášení | Barbitch Beauty Studio Brno',
  description: 'Přihlášení do osobního kabinetu Barbitch Beauty Studia.',
  robots: { index: false, follow: false },
}

// Страница-приёмник magic-link из письма (?token=).
export default function CabinetVerifyPage() {
  return (
    <>
      <style>{`html, body { background-color: #161615; }`}</style>
      <main className={'min-h-screen pb-[100px] pt-[112px] dark-tm'}>
        <Container size={'sm'}>
          <div className={'mb-5.5 text-center'}>
            <h1 className={'text-[#FFFFFFBF] text-resLg'}>{'Přihlášení'}</h1>
          </div>
          <VerifyClient />
        </Container>
      </main>
    </>
  )
}
