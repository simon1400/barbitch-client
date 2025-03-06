import type { Metadata } from 'next'

import Button from 'components/Button'

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
    keywords: ['barbitch', 'bar.bitch', 'bar bitch', 'Brno', 'Děkujeme'],
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
      <div className={'m-auto text-center'}>
        <div className={'container mx-auto w-full max-w-[800px] px-4'}>
          <div className={'mb-[50px]'}>
            <h1 className={'text-top md:text-[300px] leading-none'}>{'❤︎'}</h1>
            <h1 className={'mb-10 text-base font-bold text-white leading-none'}>
              {'Vaše rezervace byla úspěšně potvrzena!'}
            </h1>
            <p className={'text-white text-base leading-none mb-10'}>
              {'Těšíme se na vás v našem salonu a slibujeme, že váš zážitek bude jedinečný!'}
            </p>
            <p className={'text-white text-sm leading-none'}>
              {'Přiveďte kamarádku a získejte 10% slevu na další návštěvu!'}
            </p>
          </div>
          <div>
            <Button text={'zpět na úvod'} href={'/'} />
          </div>
        </div>
      </div>
    </section>
  )
}
