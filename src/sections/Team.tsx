import { Container } from 'components/Container'
import Image from 'next/image'

const Team = () => {
  return (
    <section className={'bg-accent text-white py-20'}>
      <Container size={'xl'}>
        <h2 className={'text-big mb-15'}>{'Nas tym'}</h2>
        <div className={'grid grid-cols-3 gap-15'}>
          <div className={'col-span-2'}>
            <div className={'overflow-hidden w-[130px] h-[130px] relative rounded-full mb-3.5'}>
              <Image
                src={'/assets/nails_1.jpeg'}
                objectFit={'cover'}
                objectPosition={'center'}
                fill
                alt={'asd'}
              />
            </div>
            <h4 className={'text-base font-bold mb-3.5'}>{'Natasa Mandavoska'}</h4>
            <div className={'text-sm11'}>
              <p>
                {
                  'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Integer tempor. Sed vel lectus.'
                }
              </p>
            </div>
          </div>
          <div className={'grid grid-cols-2 auto-rows-max gap-4.5'}>
            <div>
              <div className={'relative pt-[100%] overflow-hidden'}>
                <Image
                  src={'/assets/nails_1.jpeg'}
                  objectFit={'cover'}
                  objectPosition={'center'}
                  fill
                  alt={'asd'}
                />
              </div>
            </div>
            <div>
              <div className={'relative pt-[100%] overflow-hidden'}>
                <Image
                  src={'/assets/nails_2.jpeg'}
                  objectFit={'cover'}
                  objectPosition={'center'}
                  fill
                  alt={'asd'}
                />
              </div>
            </div>
            <div>
              <div className={'relative pt-[100%] overflow-hidden'}>
                <Image
                  src={'/assets/nails_3.jpeg'}
                  objectFit={'cover'}
                  objectPosition={'center'}
                  fill
                  alt={'asd'}
                />
              </div>
            </div>
            <div>
              <div className={'relative pt-[100%] overflow-hidden'}>
                <Image
                  src={'/assets/nails_1.jpeg'}
                  objectFit={'cover'}
                  objectPosition={'center'}
                  fill
                  alt={'asd'}
                />
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}

export default Team
