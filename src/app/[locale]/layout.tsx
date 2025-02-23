import type { IDataBanner } from 'fetch/banner'
import type { IDataContact } from 'fetch/contact'
import type { IDataNav } from 'fetch/nav'
import type { Metadata } from 'next'

import { GoogleTagManager } from '@next/third-parties/google'
import { Footer } from 'components/Footer'
import { Header } from 'components/Header'
import { getBanner } from 'fetch/banner'
import { getContact } from 'fetch/contact'
import { getNav } from 'fetch/nav'
import { routing } from 'i18n/routing'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import Script from 'next/script'
import { Banner } from 'sections/Banner'
import './globals.scss'

export const metadata: Metadata = {
  title: 'Bar.bitch',
  description: 'Beauty salon in Brno',
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode
  params: Promise<{ locale: string }>
}>) {
  const { locale } = await params

  // // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as any)) {
    notFound()
  }

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages()

  const dataContact: IDataContact = await getContact()
  const dataBanner: IDataBanner = await getBanner()
  const dataNav: IDataNav = await getNav()

  return (
    <html lang={locale}>
      <head>
        <link rel={'stylesheet'} href={'https://use.typekit.net/iuz5bzw.css'} />
        <meta name={'viewport'} content={'width=device-width, initial-scale=1.0'} />
        <meta name={'theme-color'} content={'#e71e6e'} />
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
      <body className={`bg-base antialiased overflow-x-hidden`}>
        <noscript>
          <img
            height={'1'}
            width={'1'}
            style={{ display: 'none' }}
            src={'https://www.facebook.com/tr?id=530946079324140&ev=PageView&noscript=1'}
          />
        </noscript>
        <NextIntlClientProvider messages={messages}>
          <Header dataNav={dataNav} linkReserve={dataContact.linkToReserve} />
          {children}
          <Banner data={dataBanner} />
          <Footer contact={dataContact} />
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
