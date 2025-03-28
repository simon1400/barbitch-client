import { Container } from 'components/Container'
import Image from 'next/image'

export const Galery = ({ data }: { data: { image: IGalery[] } }) => {
  const length = data.image.length
  return (
    <section className={'pt-0 pb-12 md:pt-10 mb:pb-17'}>
      <Container size={'xl'}>
        <div
          className={`grid grid-cols-2 md:grid-cols-${length >= 3 ? '3' : length} gap-4 md:gap-8`}
        >
          {data.image.map((item) => (
            <div key={item.documentId} className={'pt-[100%] relative'}>
              <Image
                className={'object-cover object-center'}
                src={item.url}
                fill
                alt={item.alternativeText || ''}
              />
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}
