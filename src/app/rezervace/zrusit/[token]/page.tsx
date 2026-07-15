import { redirect } from 'next/navigation'

// Легаси-URL из уже отправленных писем: отмена теперь живёт на общей странице
// управления бронью /rezervace/[token] (перенос термина + отмена).
export default async function CancelReservationPage({ params }: any) {
  const { token } = await params
  redirect(`/rezervace/${token}`)
}
