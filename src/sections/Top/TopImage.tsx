import { Container } from 'components/Container'
import Image from 'next/image'

export const TopImage = ({ title, image }: { title: string; image: IGalery }) => {
  return (
    <div
      aria-labelledby={'top-title'}
      className={`h-[80vh] md:min-h-[500px] flex items-end relative z-10 text-white mb-13.5`}
      style={{
        backgroundImage: 'linear-gradient(0deg, rgba(231,30,110,1) 0%, rgba(255,0,101,0.5) 100%)',
      }}
    >
      <div className={'mix-blend-multiply bg-[#E71E6E] absolute h-full w-full -z-10'}>
        <Image
          className={'object-cover object-center opacity-70 grayscale'}
          src={image?.url || '/assets/bigBaner.jpg'}
          fill
          alt={image?.alternativeText || ''}
        />
      </div>

      <Container size={'xl'}>
        <div className={'pb-15'}>
          <h1 id={'top-title'} className={'text-md2 leading-[45px] lg:text-big pb-4 uppercase'}>
            {title}
          </h1>
        </div>
      </Container>
    </div>
  )
}
