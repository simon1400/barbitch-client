import type { ReactNode } from 'react'

import Button from 'components/Button'
import { Container } from 'components/Container'

import HeroBackground from './HeroBackground'

export const Top = ({
  title,
  small = false,
  linkToReserve,
  admin = false,
  children,
  titleClassName = 'text-md2 lg:text-top',
}: {
  title: string
  small?: boolean
  linkToReserve: string
  admin?: boolean
  // Vlastní obsah pod nadpisem (např. tlačítka). Když je zadán, nahrazuje
  // výchozí tlačítko „Rezervovat termín“.
  children?: ReactNode
  // Přepis velikosti nadpisu (pro dlouhé tituly, které se nevejdou na mobil).
  titleClassName?: string
}) => {
  return (
    <section
      aria-labelledby={'top-title'}
      className={`${small ? 'h-[545px]' : 'h-screen md:min-h-[800px]'} flex items-end relative z-10 mb-13.5`}
    >
      <HeroBackground />

      <Container size={'xl'} className={small ? '' : 'md:min-h-[500px]'}>
        <div className={`${small ? 'pb-10' : 'pb-23'} md:pb-15 max-w-[650px] relative z-10`}>
          <h1 id={'top-title'} className={`${titleClassName} pb-4 uppercase`}>
            {title}
          </h1>

          {children ||
            (!!linkToReserve.length && !admin && (
              <div>
                <Button text={'Rezervovat termín'} id={'book-button'} href={linkToReserve} />
              </div>
            ))}
        </div>
      </Container>
    </section>
  )
}
