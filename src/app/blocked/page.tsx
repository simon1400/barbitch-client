import type { Metadata } from 'next'

import Button from 'components/Button'
import { Container } from 'components/Container'

export const dynamic = 'force-static'

export async function generateMetadata(): Promise<Metadata> {
  const title = 'Rezervace blokována | Barbitch – Manikúra, řasy a obočí v Brně'
  const description =
    'Bohužel nemůžeme vaši rezervaci zpracovat. Pro více informací nás prosím kontaktujte.'

  return {
    title,
    description,
    robots: { index: false, follow: false },
    openGraph: {
      title,
      siteName: 'Barbitch',
      locale: 'cs',
      description,
      images: ['https://barbitch.cz/assets/bigBaner.jpg'],
      url: 'https://barbitch.cz/blocked',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['https://barbitch.cz/assets/bigBaner.jpg'],
    },
    keywords: ['barbitch', 'bar.bitch', 'bar bitch', 'Brno', 'Nehty'],
    alternates: {
      canonical: 'https://barbitch.cz/blocked',
    },
  }
}

export default function Blocked() {
  return (
    <section
      className={'min-h-[600px] md:min-h-[700px] h-screen flex'}
      style={{
        backgroundImage: 'linear-gradient(0deg, rgba(231,30,110,1) 0%, rgba(255,0,101,0.5) 100%)',
      }}
    >
      <div className={'m-auto text-center relative'}>
        <div
          className={
            'absolute top-[50%] left-[50%] -translate-y-1/2 -translate-x-1/2 w-[660px] h-[578px] -z-10'
          }
        >
          <img src={'/assets/icons/heart.svg'} alt={'Pink heart icon'} />
        </div>
        <Container size={'lg'}>
          <div className={'mb-17'}>
            <h1 className={'mb-10 text-resLg md:text-xxl'}>
              {'Vaše rezervace nemůže být zpracována.'}
            </h1>
            <p className={'text-white text-baseSm md:text-baseText mb-4'}>
              {'Bohužel nemůžeme vaši rezervaci přijmout v tuto chvíli.'}
            </p>
            <p className={'text-white text-baseSm md:text-baseText font-bold'}>
              {'Pro více informací nás prosím kontaktujte přímo.'}
            </p>
          </div>
          <div>
            <Button text={'zpět na úvod'} href={'/'} />
          </div>
        </Container>
      </div>
    </section>
  )
}
