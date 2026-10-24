import type { Metadata } from 'next'

import { Container } from 'components/Container'

import { ThankYouClient } from './ThankYouClient'

export const metadata: Metadata = {
  // absolute: značka už v titulku je, šablona „%s | Barbitch“ by ji přidala podruhé
  title: { absolute: 'Platba voucheru | Barbitch Beauty Studio Brno' },
  description: 'Výsledek platby dárkového voucheru.',
  robots: { index: false, follow: false },
}

// Návrat z platební brány Comgate (s275): /darkovy-voucher/dekujeme?t=<token>.
// Stav se čte ze Strapi podle tokenu; dokud platba čeká, stránka se ptá znovu.
export default async function VoucherThankYouPage({ searchParams }: any) {
  const sp = (await searchParams) || {}
  const token = typeof sp.t === 'string' ? sp.t : ''

  return (
    <>
      <style>{`html, body { background-color: #161615; }`}</style>
      <main className={'min-h-screen pb-[100px] pt-[112px] dark-tm'}>
        <Container size={'sm'}>
          <div className={'mb-5.5 text-center'}>
            <h1 className={'text-[#FFFFFFBF] text-resLg'}>{'Dárkový voucher'}</h1>
          </div>
          <ThankYouClient token={token} />
        </Container>
      </main>
    </>
  )
}
