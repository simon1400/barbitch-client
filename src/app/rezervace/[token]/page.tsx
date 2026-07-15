import type { Metadata } from 'next'

import { Container } from 'components/Container'
import { getContact } from 'fetch/contact'

import { getEngineManage } from '../../book/fetch/engine'

import { ManageClient } from './ManageClient'

export const metadata: Metadata = {
  title: 'Moje rezervace | Barbitch Beauty Studio Brno',
  description: 'Správa rezervace v Barbitch Beauty Studiu v Brně — změna termínu nebo zrušení.',
  robots: { index: false, follow: false },
}

// Страница управления бронью клиентом (ссылка «Spravovat rezervaci» из писем).
// Перенос термина (тот же мастер и услуга) + отмена; правила (3 часа, лимит
// переносов) — серверные, движок вернёт too_late/reschedule_limit.
export default async function ManageReservationPage({ params }: any) {
  const { token } = await params

  const [infoResult, contact] = await Promise.all([
    getEngineManage(token).then(
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
            <h1 className={'text-[#FFFFFFBF] text-resLg'}>{'Moje rezervace'}</h1>
          </div>
          {infoResult.info ? (
            <ManageClient token={token} initialInfo={infoResult.info} salonPhone={contact.phone} />
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
