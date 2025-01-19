'use client'
import type { ISocItem } from 'fetch/contact'
import { FacebookIcon } from 'icons/Facebook'
import { InstagramIcon } from 'icons/Instagram'
import { TiktokIcon } from 'icons/Tiktok'

import Link from 'next/link'

export const SocNav = ({ items }: { items?: ISocItem[] }) => {
  return (
    <nav>
      <ul className={'flex'}>
        {items &&
          items.map((item: ISocItem) => (
            <li key={item.type}>
              <Link
                href={item.link}
                className={'duration-200 fill-primary hover:fill-accent'}
                target={'_blank'}
              >
                {item.type === 'instagram' && <span className={'block w-8 lg:w-16'}><InstagramIcon /></span>}
                {item.type === 'tiktok' && <span className={'block w-8 lg:w-16'}><TiktokIcon /></span>}
                {item.type === 'facebook' && <span className={'block w-8 lg:w-16'}><FacebookIcon /></span>}
              </Link>
            </li>
          ))}
      </ul>
    </nav>
  )
}
