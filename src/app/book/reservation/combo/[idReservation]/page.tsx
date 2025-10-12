import ComboBookForm from './ComboBookForm'

export default async function ComboBookServicePage({ params }: any) {
  const { idReservation } = await params

  return <ComboBookForm idReservation={idReservation} />
}
