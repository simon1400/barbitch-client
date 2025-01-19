'use client'

import Link from "next/link"

const Lang = ({ menu }: { menu: boolean }) => {
  return (
    <nav>
      <ul className={`flex gap-3 justify-end mb-12 lg:mb-0 lg:justify-start`}>
        {['cs', 'ru'].map((item: string) => {
          let color = 'text-white hover:text-primary'
          if ('cs' === item) {
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
