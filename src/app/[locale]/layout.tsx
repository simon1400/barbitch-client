import type { IDataBanner } from 'fetch/banner'
import type { IDataContact } from 'fetch/contact'
import type { IDataNav } from 'fetch/nav'
import type { Metadata } from 'next'

import { GoogleAnalytics } from '@next/third-parties/google'
import { Footer } from 'components/Footer'
import { Header } from 'components/Header'
import { getBanner } from 'fetch/banner'
import { getContact } from 'fetch/contact'
import { getNav } from 'fetch/nav'
import { routing } from 'i18n/routing'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { Banner } from 'sections/Banner'

import './globals.css'

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
      </head>
      {/* <!-- Google tag (gtag.js) --> */}

      <GoogleAnalytics gaId={'G-6BLR9FQVT3'} />
      <body className={`bg-base antialiased`}>
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
