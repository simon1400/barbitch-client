import type { Metadata } from 'next'

import Button from 'components/Button'
import { Container } from 'components/Container'
import { HeartIcon } from 'icons/Heart'

export async function generateMetadata(): Promise<Metadata> {
  const title = 'Děkujeme | Barbitch – Manikúra, řasy a obočí v Brně'
  const description =
    'Objevte moderní beauty studio Bar.bitch v Brně. Profesionální manikúra, trendy obočí a dokonalé řasy. Individuální přístup a relaxace s kvalitními materiály. Rezervujte si termín ještě dnes!'

  return {
    title,
    description,
    openGraph: {
      title,
      siteName: 'Barbitch',
      locale: 'cs',
      description,
      images: ['https://barbitch.cz/assets/bigBaner.jpg'],
      url: 'https://barbitch.cz/thank-you',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['https://barbitch.cz/assets/bigBaner.jpg'],
    },
    keywords: ['barbitch', 'bar.bitch', 'bar bitch', 'Brno', 'Nehty', 'Děkujeme'],
    alternates: {
      canonical: 'https://barbitch.cz/thank-you',
    },
  }
}

export default function ThankYou() {
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
          <HeartIcon />
        </div>
        <Container size={'lg'}>
          <div className={'mb-17'}>
            <h1 className={'mb-10 text-resLg md:text-xxl'}>{'Vaše rezervace je potvrzena.'}</h1>
            <p className={'text-white text-baseSm md:text-baseText'}>
              {'Těšíme se na vás v našem salonu a slibujeme, že váš zážitek bude jedinečný!'}
            </p>
            <p className={'text-white text-baseSm md:text-baseText font-bold'}>
              {'Přiveďte kamarádku a získejte 10% slevu na další návštěvu!'}
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
