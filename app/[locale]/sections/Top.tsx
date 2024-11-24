'use client'
import { useTranslations } from 'next-intl'

import Button from '../components/Button'

export const Top = ({ title, small = false }: { title: string; small?: boolean }) => {
  const t = useTranslations('Global')
  return (
    <section
      className={`${small ? 'h-[545px]' : 'h-screen'} bg-gradient-to-t from-[#E71E6E] to-[#FF006580] mix-blend-multiply flex items-end relative z-10`}
    >
      <div className={'container mx-auto w-full max-w-[1400px] px-4'}>
        <div className={'pb-5 lg:pb-15'}>
          <h1 className={'text-md1 lg:text-top pb-4'}>{title}</h1>
          <Button text={t('reserve')} href={'https://noona.app/cs/barbitch'} />
        </div>
      </div>
    </section>
  )
}
