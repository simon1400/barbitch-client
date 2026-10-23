import type { Metadata } from 'next'

import { Container } from 'components/Container'

import { getUnsubscribeInfo } from '../fetch'

import { UnsubscribeClient } from './UnsubscribeClient'

export const metadata: Metadata = {
  // absolute: značka už v titulku je, šablona „%s | Barbitch“ by ji přidala podruhé
  title: { absolute: 'Odhlášení z e-mailů | Barbitch Beauty Studio Brno' },
  description: 'Odhlášení z připomenutí a nabídek e-mailem.',
  robots: { index: false, follow: false },
}

// Отписка по ссылке из письма (s271). Открытие страницы НИЧЕГО не меняет —
// почтовые сканеры (Outlook, Gmail) открывают все ссылки сами; отписывает
// только кнопка. Кнопка «Odhlásit» в самом почтовике бьёт в Strapi напрямую
// (List-Unsubscribe-Post), сюда не заходит.
export default async function UnsubscribePage({ params, searchParams }: any) {
  const { token } = await params
  const sp = (await searchParams) || {}
  const origin = typeof sp.z === 'string' ? sp.z : null

  const info = await getUnsubscribeInfo(token).catch(() => null)

  return (
    <>
      <style>{`html, body { background-color: #161615; }`}</style>
      <main className={'min-h-screen pb-[100px] pt-[112px] dark-tm'}>
        <Container size={'sm'}>
          <div className={'mb-5.5 text-center'}>
            <h1 className={'text-[#FFFFFFBF] text-resLg'}>{'Odhlášení z e-mailů'}</h1>
          </div>
          {info ? (
            <UnsubscribeClient token={token} origin={origin} initialInfo={info} />
          ) : (
            <div className={'bg-[#252523] rounded-special-small p-6 text-center'}>
              <p className={'text-white text-resMd1 mb-1'}>{'Odkaz je neplatný'}</p>
              <p className={'text-[#A0A0A0] text-xss'}>
                {
                  'Odkaz se nepodařilo ověřit. Odpovězte prosím na náš e-mail slovem NEZASÍLAT a odhlásíme vás ručně.'
                }
              </p>
            </div>
          )}
        </Container>
      </main>
    </>
  )
}
