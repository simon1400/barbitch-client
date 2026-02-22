import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Výběr termínu | Rezervace – Barbitch Beauty Studio Brno',
  description: 'Vyberte datum a čas pro vaši rezervaci v Barbitch Beauty Studiu v Brně.',
  robots: { index: false, follow: false },
}

export default function PersonalLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
