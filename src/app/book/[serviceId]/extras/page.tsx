import type { Metadata } from 'next'

import { redirect } from 'next/navigation'

import { getAddonGroup } from '../../fetch/addonGroupService'

import { ExtrasSelector } from './ExtrasSelector'

export const metadata: Metadata = {
  title: 'Doplňkové služby | Rezervace – Barbitch Beauty Studio Brno',
  description: 'Přidejte doplňkové služby ke své rezervaci v Barbitch Beauty Studiu v Brně.',
  robots: { index: false, follow: false },
}

const ExtrasPage = async ({ params }: any) => {
  const { serviceId } = await params
  const group = await getAddonGroup(serviceId)

  if (!group) {
    redirect(`/book/${serviceId}`)
  }

  return <ExtrasSelector serviceId={serviceId} group={group} />
}

export default ExtrasPage
