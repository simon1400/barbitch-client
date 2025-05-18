import type { Metadata } from 'next'

import { GoogleTagManager } from '@next/third-parties/google'
import Footer from 'components/Footer'
import { Header } from 'components/Header'
import { AppProvider } from 'context/AppContext'
import { Montserrat } from 'next/font/google'
import Banner from 'sections/Banner'
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
  return (
    <html lang={'cs'}>
      <head>
        <meta name={'viewport'} content={'width=device-width, initial-scale=1.0'} />
        <meta name={'theme-color'} content={'#e71e6e'} />
        <meta name={'yandex-verification'} content={'93178409d4f4b109'} />
        <link rel={'icon'} type={'image/png'} href={'/favicon/favicon-96x96.png'} sizes={'96x96'} />
        <link rel={'icon'} type={'image/svg+xml'} href={'/favicon/favicon.svg'} />
        <link rel={'shortcut icon'} href={'/favicon/favicon.ico'} />
        <link rel={'apple-touch-icon'} sizes={'180x180'} href={'/favicon/apple-touch-icon.png'} />
        <link rel={'manifest'} href={'/favicon/site.webmanifest'} />
      </head>
      <GoogleTagManager gtmId={'GTM-5SP5MPTB'} />
      <body className={`bg-base antialiased overflow-x-hidden ${montserat.className}`}>
        <AppProvider>
          <Header />
          {children}
          <Banner />
          <Footer />
        </AppProvider>
      </body>
    </html>
  )
}
