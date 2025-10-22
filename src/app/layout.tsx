import type { Metadata } from 'next'

import Footer from 'components/Footer'
import { Header } from 'components/Header'
import { AppProvider } from 'context/AppContext'
import { Montserrat } from 'next/font/google'
import Script from 'next/script'
import Banner from 'sections/Banner'
import './globals.scss'

export const metadata: Metadata = {
  title: 'Bar.bitch',
  description: 'Beauty salon in Brno',
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
        <meta name={'apple-mobile-web-app-capable'} content={'yes'} />
        <meta name={'apple-mobile-web-app-status-bar-style'} content={'black-translucent'} />
        <meta name={'yandex-verification'} content={'93178409d4f4b109'} />
        <link rel={'preconnect'} href={'https://res.cloudinary.com'} />
        <link rel={'preconnect'} href={'https://strapi.barbitch.cz'} />
        <link rel={'dns-prefetch'} href={'https://lh3.googleusercontent.com'} />
        <link rel={'icon'} type={'image/png'} href={'/favicon/favicon-96x96.png'} sizes={'96x96'} />
        <link rel={'icon'} type={'image/svg+xml'} href={'/favicon/favicon.svg'} />
        <link rel={'shortcut icon'} href={'/favicon/favicon.ico'} />
        <link rel={'apple-touch-icon'} sizes={'180x180'} href={'/favicon/apple-touch-icon.png'} />
        <link rel={'manifest'} href={'/favicon/site.webmanifest'} />
      </head>
      <Script
        id={'gtm-script'}
        strategy={'lazyOnload'}
        src={'https://www.googletagmanager.com/gtm.js?id=GTM-5SP5MPTB'}
      />
      <Script id={'gtm-init'} strategy={'lazyOnload'}>
        {`
          window.dataLayer = window.dataLayer || [];
          window.dataLayer.push({
            'gtm.start': new Date().getTime(),
            event: 'gtm.js',
          });
        `}
      </Script>
      <body className={`bg-base antialiased overflow-x-hidden ${montserat.className}`}>
        <AppProvider>
          <Header />
          {children}
          <Banner />
          <Footer />
        </AppProvider>
        {/* <!--Start of Tawk.to Script--> */}
        <Script>
          {`var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
            (function(){
            var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
            s1.async=true;
            s1.src='https://embed.tawk.to/686a45cce82cfa190ecdc718/1ivfi1aam';
            s1.charset='UTF-8';
            s1.setAttribute('crossorigin','*');
            s0.parentNode.insertBefore(s1,s0);
            })();`}
        </Script>
        {/* <!--End of Tawk.to Script--> */}
      </body>
    </html>
  )
}
