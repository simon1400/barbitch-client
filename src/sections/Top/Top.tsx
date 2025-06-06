import Button from 'components/Button'
import { Container } from 'components/Container'
import { Montserrat } from 'next/font/google'
const montserat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '700'],
  display: 'swap',
})

export const Top = ({
  title,
  small = false,
  linkToReserve,
}: {
  title: string
  small?: boolean
  linkToReserve: string
}) => {
  return (
    <section
      aria-labelledby={'top-title'}
      className={`${
        small ? 'h-[545px]' : 'h-screen md:min-h-[800px]'
      } mix-blend-multiply flex items-end relative z-10 mb-13.5 bg-gradient-to-t from-[rgba(231,30,110,1)] to-[rgba(255,0,101,0.5)]`}
    >
      <Container size={'xl'} className={small ? '' : 'md:min-h-[500px]'}>
        <div className={`${small ? 'pb-10' : 'pb-23'} md:pb-15 max-w-[650px]`}>
          <h1
            id={'top-title'}
            className={`text-md2 lg:text-top pb-4 uppercase ${montserat.className}`}
          >
            {title}
          </h1>

          {!!linkToReserve.length && (
            <div>
              <Button text={'Rezervovat termín'} id={'book-button'} href={linkToReserve} />
            </div>
          )}
        </div>
      </Container>
    </section>
  )
}
