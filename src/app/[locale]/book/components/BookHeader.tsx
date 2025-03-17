'use client'
import { ChevronLeft } from 'icons/ChevronLeft'
import { useParams, useRouter } from 'next/navigation'

export const BookHeader = () => {
  const params = useParams()
  const router = useRouter()

  const handleBack = (e: any) => {
    if (params?.serviceId || params?.idReservation) {
      e.preventDefault()
      router.back()
    }
  }

  return (
    <>
      <div>
        <a
          href={'/'}
          onClick={(e) => handleBack(e)}
          className={'flex items-center gap-3 text-[#A0A0A0] text-resXs mb-5'}
        >
          <ChevronLeft />
          <span>
            {params?.serviceId
              ? 'zpět na výběr služby'
              : params?.personalId
                ? 'zpět na výběr obsluhy'
                : params?.idReservation
                  ? 'zpět na výběr datumu'
                  : 'zpět na úvodní stránku'}
          </span>
        </a>
      </div>
      <div className={'mb-5.5 text-center'}>
        <h1 className={'text-[#FFFFFFBF] text-resLg'}>
          {params?.serviceId
            ? 'Vyberte si obsluhu'
            : params?.personalId
              ? 'Vyberte si datum a čas'
              : params?.idReservation
                ? 'Objednávka'
                : 'Vyberte službu'}
        </h1>
      </div>
    </>
  )
}
