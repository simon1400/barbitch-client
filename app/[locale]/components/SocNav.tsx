'use client'
import type { ISocItem } from '../../../fetch/contact'

import Link from 'next/link'
import Facebook from '/public/assets/fb.svg'
import Instagram from '/public/assets/insta.svg'
import Tiktok from '/public/assets/tik.svg'

export const SocNav = ({ items }: { items?: ISocItem[] }) => {
  return (
    <nav>
      <ul className={'flex'}>
        {items &&
          items.map((item: ISocItem) => (
            <li key={item.type}>
              <Link href={item.link} target={'_blank'}>
                {item.type === 'instagram' && <Instagram className={'w-8 lg:w-16'} />}
                {item.type === 'tiktok' && <Tiktok className={'w-8 lg:w-16'} />}
                {item.type === 'facebook' && <Facebook className={'w-8 lg:w-16'} />}
              </Link>
            </li>
          ))}
      </ul>
    </nav>
  )
}
