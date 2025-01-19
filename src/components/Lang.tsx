'use client'

import { Link, routing } from 'i18n/routing'
import { useLocale } from 'next-intl'

const Lang = ({ menu }: { menu: boolean }) => {
  const locale = useLocale()
  return (
    <nav>
      <ul className={`flex gap-3 justify-end mb-12 lg:mb-0 lg:justify-start`}>
        {routing.locales.map((item: string) => {
          let color = 'text-white hover:text-primary'
          if (locale === item) {
            color = menu ? 'text-primary' : 'text-accent'
          }
          return (
            <li key={item}>
              <Link className={`text-sm uppercase ${color} duration-200`} href={'/'} locale={item}>
                {item}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

export default Lang
