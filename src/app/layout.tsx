import type { Metadata } from 'next'

import { GoogleTagManager } from '@next/third-parties/google'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { AppProvider } from 'app/context/AppContext'
import { Footer } from 'components/Footer'
import { Header } from 'components/Header'
import { getBanner } from 'fetch/banner'
import { getContact } from 'fetch/contact'
import { getNav } from 'fetch/nav'
import { Montserrat } from 'next/font/google'
import Script from 'next/script'
import { Banner } from 'sections/Banner'
import './globals.scss'

export const metadata: Metadata = {
  title: 'Bar.bitch',
  description: 'Beauty salon in Brno',
}

const montserat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '700'],
})

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const [dataContact, dataBanner, dataNav] = await Promise.all([
    getContact(),
    getBanner(),
    getNav(),
  ])

  return (
    <html lang={'cs'}>
      <head>
        <link rel={'preconnect'} href={'https://connect.facebook.net'} crossOrigin={'anonymous'} />
        <meta name={'viewport'} content={'width=device-width, initial-scale=1.0'} />
        <meta name={'theme-color'} content={'#e71e6e'} />
        <meta name={'yandex-verification'} content={'93178409d4f4b109'} />
        <link rel={'icon'} type={'image/png'} href={'/favicon/favicon-96x96.png'} sizes={'96x96'} />
        <link rel={'icon'} type={'image/svg+xml'} href={'/favicon/favicon.svg'} />
        <link rel={'shortcut icon'} href={'/favicon/favicon.ico'} />
        <link rel={'apple-touch-icon'} sizes={'180x180'} href={'/favicon/apple-touch-icon.png'} />
        <link rel={'manifest'} href={'/favicon/site.webmanifest'} />
        <Script id={'Meta pixel'}>
          {`!function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '530946079324140');
            fbq('track', 'PageView');`}
        </Script>
      </head>
      {/* <!-- Google tag (gtag.js) --> */}
      <GoogleTagManager gtmId={'GTM-5SP5MPTB'} />
      <body className={`bg-base antialiased overflow-x-hidden ${montserat.className}`}>
        <noscript>
          <img
            height={'1'}
            width={'1'}
            style={{ display: 'none' }}
            src={'https://www.facebook.com/tr?id=530946079324140&ev=PageView&noscript=1'}
          />
        </noscript>
        <AppProvider>
          <Header dataNav={dataNav} linkReserve={dataContact.linkToReserve} />
          {children}
          <Banner data={dataBanner} />
          <Footer contact={dataContact} />
        </AppProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
