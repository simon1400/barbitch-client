import Button from 'components/Button'
import Image from 'next/image'

export const Banner = ({
  data,
}: {
  data: {
    title?: string
    cta: {
      title: string
      link: string
    }
    image?: IGalery
  }
}) => {
  return (
    <section className={'pb-10 md:pb-17'}>
      <div className={'container mx-auto w-full max-w-[840px] px-4'}>
        <div
          style={{
            backgroundImage:
              'linear-gradient(0deg, rgba(231,30,110,1) 0%, rgba(255,0,101,0.5) 100%)',
          }}
          className={`${data.image ? '' : 'mix-blend-multiply'} relative text-center px-13.5 py-18`}
        >
          {data.image && (
            <div className={'top-0 left-0 absolute overflow-hidden w-full h-full -z-10 opacity-90'}>
              <Image
                className={'object-cover object-center w-full h-full grayscale'}
                src={data.image.url}
                fill
                alt={data.image.alternativeText || ''}
              />
            </div>
          )}
          <h2 className={`banner-head`}>{data.title}</h2>
          <Button text={data.cta.title} blank href={data.cta.link} />
        </div>
      </div>
    </section>
  )
}
