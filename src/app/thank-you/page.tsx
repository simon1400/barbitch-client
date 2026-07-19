import type { Metadata } from 'next'

import ThankYouClient from './ThankYouClient'

export const dynamic = 'force-static'

export async function generateMetadata(): Promise<Metadata> {
  const title = 'Děkujeme | Barbitch – Manikúra, řasy a obočí v Brně'
  const description =
    'Objevte moderní beauty studio Bar.bitch v Brně. Profesionální manikúra, trendy obočí a dokonalé řasy. Individuální přístup a relaxace s kvalitními materiály. Rezervujte si termín ještě dnes!'

  return {
    title,
    description,
    robots: { index: false, follow: false },
    openGraph: {
      title,
      siteName: 'Barbitch',
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
    keywords: ['barbitch', 'bar.bitch', 'bar bitch', 'Brno', 'Nehty', 'Děkujeme'],
    alternates: {
      canonical: 'https://barbitch.cz/thank-you',
    },
  }
}

// Контент клиентский: подтверждение + предложения дозаписи (rebook) по данным
// только что созданной брони из sessionStorage; без них — обычный статичный экран.
export default function ThankYou() {
  return <ThankYouClient />
}
