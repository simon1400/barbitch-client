import type { IDataHomepageService } from 'fetch/service'

import { Container } from 'components/Container'
import { Hand } from 'components/Hand'
import Image from 'next/image'
import Link from 'next/link'

const HandSec = ({ service }: { service: IDataHomepageService[] }) => {
  return (
    <>
      <section className={'hidden lg:block py-11.5'}>
        <Container size={'xl'}>
          <Hand />
        </Container>
      </section>
      <section className={'lg:hidden py-16'}>
        <Container size={'xl'}>
          <div className={'pr-16 pl-8 mb-8'}>
            <Image
              src={'/assets/icons/smallHand.svg'}
              alt={'Small hand Barbitch'}
              width={200}
              height={150}
              className={'w-auto h-auto'}
            />
          </div>
          <nav>
            <ul>
              {service.map((item: IDataHomepageService) => (
                <li key={item.shortTitle} className={'mb-4'}>
                  <Link href={`/service/${item.slug}`} className={'flex text-md1 uppercase gap-3'}>
                    <span>{item.shortTitle}</span>
                    <Image
                      src={'/assets/icons/arrowRight.svg'}
                      alt={'Arrow right icon'}
                      width={24}
                      height={24}
                      className={'w-auto h-auto'}
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </Container>
      </section>
    </>
  )
}

export default HandSec
