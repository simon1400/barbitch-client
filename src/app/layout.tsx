import type { Metadata } from 'next'

import CookieConsent from 'components/CookieConsent'
import FacebookPageView from 'components/FacebookPageView'
import Footer from 'components/Footer'
import { Header } from 'components/Header'
import { AppProvider } from 'context/AppContext'
import { HideOnRoutes } from 'helpers/HideOnRoutes'
import { Montserrat } from 'next/font/google'
import Script from 'next/script'
import { Suspense } from 'react'
import Banner from 'sections/Banner'
import './globals.scss'

export const metadata: Metadata = {
  metadataBase: new URL('https://barbitch.cz'),
  title: {
    default: 'Barbitch – Manikúra, řasy a obočí v Brně',
    template: '%s | Barbitch',
  },
  description:
    'Objevte moderní beauty studio Bar.bitch v Brně. Profesionální manikúra, trendy obočí a dokonalé řasy. Individuální přístup a relaxace s kvalitními materiály. Rezervujte si termín ještě dnes!',
  openGraph: {
    title: 'Barbitch – Manikúra, řasy a obočí v Brně',
    description:
      'Objevte moderní beauty studio Bar.bitch v Brně. Profesionální manikúra, trendy obočí a dokonalé řasy. Individuální přístup a relaxace s kvalitními materiály. Rezervujte si termín ještě dnes!',
    url: 'https://barbitch.cz',
    siteName: 'Barbitch',
    locale: 'cs_CZ',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
}

const montserat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '700'],
  display: 'swap',
  fallback: ['Arial', 'sans-serif'],
})

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang={'cs'}>
      <head>
        <meta name={'viewport'} content={'width=device-width, initial-scale=1.0'} />
        <meta name={'theme-color'} content={'#e71e6e'} />
        <meta name={'mobile-web-app-capable'} content={'yes'} />
        <meta name={'apple-mobile-web-app-status-bar-style'} content={'black-translucent'} />
        <meta name={'yandex-verification'} content={'93178409d4f4b109'} />
        <link rel={'preconnect'} href={'https://ik.imagekit.io'} />
        <link rel={'preconnect'} href={'https://strapi.barbitch.cz'} />
        <link rel={'preconnect'} href={'https://featurable.com'} />
        <link rel={'dns-prefetch'} href={'https://lh3.googleusercontent.com'} />
        <link rel={'icon'} type={'image/png'} href={'/favicon/favicon-96x96.png'} sizes={'96x96'} />
        <link rel={'icon'} type={'image/svg+xml'} href={'/favicon/favicon.svg'} />
        <link rel={'shortcut icon'} href={'/favicon/favicon.ico'} />
        <link rel={'apple-touch-icon'} sizes={'180x180'} href={'/favicon/apple-touch-icon.png'} />
        <link rel={'manifest'} href={'/favicon/site.webmanifest'} />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer=window.dataLayer||[];
              function gtag(){dataLayer.push(arguments);}
              gtag('consent','default',{
                analytics_storage:'denied',
                ad_storage:'denied',
                ad_user_data:'denied',
                ad_personalization:'denied',
                functionality_storage:'denied',
                personalization_storage:'denied',
                security_storage:'granted'
              });
            `,
          }}
        />
      </head>
      <Script id={'gtm-init'} strategy={'afterInteractive'}>
        {`
          window.dataLayer=window.dataLayer||[];
          window.dataLayer.push({'gtm.start':new Date().getTime(),event:'gtm.js'});
          var s=document.createElement('script');
          s.async=true;
          s.src='https://www.googletagmanager.com/gtm.js?id=GTM-5SP5MPTB';
          document.head.appendChild(s);
        `}
      </Script>
      <body className={`bg-base antialiased overflow-x-hidden ${montserat.className}`}>
        <AppProvider>
          <FacebookPageView />
          <Suspense
            fallback={
              <header className={'absolute w-full z-50'}>
                <div className={'max-w-[1280px] mx-auto px-4'}>
                  <div className={'flex justify-between py-3 lg:py-8 items-center'}>
                    <div className={'w-[120px] h-[40px]'} />
                    <div className={'w-[180px] h-[40px]'} />
                  </div>
                </div>
              </header>
            }
          >
            <Header />
          </Suspense>
          {children}
          <HideOnRoutes routes={['/book', '/kontakt']}>
            <Suspense>
              <Banner />
            </Suspense>
          </HideOnRoutes>
          <HideOnRoutes routes={['/book']}>
            <Suspense>
              <Footer />
            </Suspense>
          </HideOnRoutes>

          <CookieConsent />
        </AppProvider>
      </body>
    </html>
  )
}
