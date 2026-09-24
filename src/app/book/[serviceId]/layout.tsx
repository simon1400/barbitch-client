import { notFound } from 'next/navigation'

import { engineErrorCode } from '../fetch/engine'
import { getEngineServiceCached } from '../fetch/serviceCache'

// Kontrola služby MUSÍ být tady, ne ve stránce: stránky tohoto kroku mají
// loading.tsx, streamují se a stavový kód 200 už je pryč dřív, než by se
// notFound() zavolal. Layout se renderuje před tou hranicí → skutečný 404.
// Výpadek engine (5xx/timeout) chybu propustí dál → book/error.tsx, status 500.
export default async function BookServiceLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ serviceId: string }>
}) {
  const { serviceId } = await params

  try {
    await getEngineServiceCached(serviceId)
  } catch (error) {
    if (engineErrorCode(error) === 'service_not_found') notFound()
    throw error
  }

  return <>{children}</>
}
