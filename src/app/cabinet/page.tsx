import type { Metadata } from 'next'

import { Container } from 'components/Container'
import { getContact } from 'fetch/contact'

import { CabinetClient } from './CabinetClient'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Můj účet | Barbitch Beauty Studio Brno',
  description: 'Osobní kabinet klienta Barbitch Beauty Studia v Brně.',
  robots: { index: false, follow: false },
}

// Личный кабинет клиента (magic-link auth → JWT в localStorage).
// Весь гейт/данные — на клиенте (CabinetClient); сервер отдаёт только shell.
export default async function CabinetPage() {
  const contact = await getContact()

  return (
    <>
      <style>{`html, body { background-color: #161615; }`}</style>
      <main className={'min-h-screen pb-[100px] pt-[112px] dark-tm'}>
        <Container size={'sm'}>
          <div className={'mb-5.5 text-center'}>
            <h1 className={'text-[#FFFFFFBF] text-resLg'}>{'Můj účet'}</h1>
          </div>
          <CabinetClient salonPhone={contact.phone} />
        </Container>
      </main>
    </>
  )
}
