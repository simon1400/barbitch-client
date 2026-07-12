import type { Metadata } from 'next'

import { Container } from 'components/Container'
import { getContact } from 'fetch/contact'

import { getEngineCancel } from '../../../book/fetch/engine'

import { CancelClient } from './CancelClient'

export const metadata: Metadata = {
  title: 'Zrušení rezervace | Barbitch Beauty Studio Brno',
  description: 'Zrušení rezervace v Barbitch Beauty Studiu v Brně.',
  robots: { index: false, follow: false },
}

// Страница отмены брони клиентом (ссылка с cancel-токеном пойдёт в письма, шаг 6).
// Правило «не позже чем за 3 часа» — серверное (движок вернёт too_late).
export default async function CancelReservationPage({ params }: any) {
  const { token } = await params

  const [infoResult, contact] = await Promise.all([
    getEngineCancel(token).then(
      (info) => ({ info, notFound: false }),
      () => ({ info: null, notFound: true }),
    ),
    getContact(),
  ])

  return (
    <>
      <style>{`html, body { background-color: #161615; }`}</style>
      <main className={'min-h-screen pb-[100px] pt-[112px] dark-tm'}>
        <Container size={'sm'}>
          <div className={'mb-5.5 text-center'}>
            <h1 className={'text-[#FFFFFFBF] text-resLg'}>{'Zrušení rezervace'}</h1>
          </div>
          {infoResult.info ? (
            <CancelClient token={token} initialInfo={infoResult.info} salonPhone={contact.phone} />
          ) : (
            <div className={'bg-[#252523] rounded-special-small p-6 text-center'}>
              <p className={'text-white text-resMd1 mb-1'}>{'Rezervace nenalezena'}</p>
              <p className={'text-[#A0A0A0] text-xss'}>
                {'Odkaz je neplatný nebo rezervace už neexistuje.'}
              </p>
            </div>
          )}
        </Container>
      </main>
    </>
  )
}
