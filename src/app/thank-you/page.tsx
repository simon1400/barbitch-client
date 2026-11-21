import type { Metadata } from 'next'

import { BRAND } from 'lib/seo'

import ThankYouClient from './ThankYouClient'

export const dynamic = 'force-static'

export async function generateMetadata(): Promise<Metadata> {
  const title = 'Děkujeme | Bar.Bitch – Manikúra, řasy a obočí v Brně'
  const description =
    'Objevte moderní beauty studio Bar.Bitch v Brně. Profesionální manikúra, trendy obočí a dokonalé řasy. Individuální přístup a relaxace s kvalitními materiály. Rezervujte si termín ještě dnes!'

  return {
    // `absolute` — titulek už značku obsahuje, šablona by ji přidala podruhé.
    title: { absolute: title },
    description,
    robots: { index: false, follow: false },
    openGraph: {
      title,
      siteName: BRAND,
      locale: 'cs_CZ',
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
    // Žádný canonical: stránka je noindex, kanonizovat ji na sebe je protimluv.
  }
}

// Контент клиентский: подтверждение + предложения дозаписи (rebook) по данным
// только что созданной брони из sessionStorage; без них — обычный статичный экран.
export default function ThankYou() {
  return <ThankYouClient />
}
