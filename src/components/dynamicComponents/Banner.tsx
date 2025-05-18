import Button from 'components/Button'
import { Container } from 'components/Container'
import Image from 'next/image'

export const Banner = ({
  data,
}: {
  data: {
    title?: string
    cta?: {
      title: string
      link: string
    }
    image?: IGalery
  }
}) => {
  return (
    <section className={'pb-10 md:pb-15'}>
      <Container size={'lg'}>
        <div
          style={{
            backgroundImage:
              'linear-gradient(0deg, rgba(231,30,110,1) 0%, rgba(255,0,101,0.5) 100%)',
          }}
          className={`relative text-center px-7 md:px-13.5 py-9 md:py-18 z-10 flex items-center justify-center flex-col`}
        >
          {data.image && (
            <div
              className={
                'top-0 left-0 mix-blend-multiply bg-[#E71E6E] absolute w-full h-full -z-10'
              }
            >
              <Image
                className={'object-cover object-center opacity-60 grayscale'}
                src={data.image.url}
                fill
                alt={data.image.alternativeText || ''}
              />
            </div>
          )}
          <h2 className={`banner-head text-white ${!data.cta ? 'mb-0 md:mb-0' : 'mb-6 md:!mb-12'}`}>
            {data.title}
          </h2>
          {data.cta && <Button text={data.cta.title} href={data.cta.link} />}
        </div>
      </Container>
    </section>
  )
}
