import { Container } from 'components/Container'
import Image from 'next/image'

export const Galery = ({
  data,
  contain = true,
}: {
  data: { image: IGalery[] }
  contain?: boolean
}) => {
  const length = data.image.length
  return (
    <section className={'pt-0 pb-12 mb:pb-17'}>
      <Container size={'xl'}>
        <div
          className={`grid grid-cols-${length > 1 ? '2' : length} md:grid-cols-${length >= 3 ? '3' : length} gap-4 md:gap-8`}
        >
          {data.image.map((item) => (
            <div key={item.documentId} className={`${!contain && 'pt-[100%]'} relative`}>
              <Image
                className={`${contain ? 'object-contain' : 'object-cover'} object-center`}
                src={item.url}
                width={length > 1 ? 700 : 1400}
                height={1000}
                fill={!contain}
                alt={item.alternativeText || ''}
              />
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}
