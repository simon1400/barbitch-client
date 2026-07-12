import type { Metadata } from 'next'

import { redirect } from 'next/navigation'

import { getEngineService } from '../../fetch/engine'

import { ExtrasSelector } from './ExtrasSelector'

export const metadata: Metadata = {
  title: 'Doplňkové služby | Rezervace – Barbitch Beauty Studio Brno',
  description: 'Přidejte doplňkové služby ke své rezervaci v Barbitch Beauty Studiu v Brně.',
  robots: { index: false, follow: false },
}

const ExtrasPage = async ({ params }: any) => {
  const { serviceId } = await params

  let service: Awaited<ReturnType<typeof getEngineService>> | null = null
  try {
    service = await getEngineService(serviceId)
  } catch {
    // Неизвестный id (напр. легаси-ссылка на combo из старого письма) → на выбор услуги.
    service = null
  }

  if (!service) redirect('/book')

  // Без вариантов и дополнений выбирать нечего — сразу на выбор мастера.
  // service.id = канонический documentId (легаси noonaBaseId уже отрезолвлен движком).
  if (!service.variants.length && !service.modifiers.length) {
    redirect(`/book/${service.id}`)
  }

  return <ExtrasSelector service={service} />
}

export default ExtrasPage
