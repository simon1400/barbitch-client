import { redirect } from 'next/navigation'

import { getAddonGroup } from '../../fetch/addonGroupService'

import { ExtrasSelector } from './ExtrasSelector'

const ExtrasPage = async ({ params }: any) => {
  const { serviceId } = await params
  const group = await getAddonGroup(serviceId)

  if (!group) {
    redirect(`/book/${serviceId}`)
  }

  return <ExtrasSelector serviceId={serviceId} group={group} />
}

export default ExtrasPage
