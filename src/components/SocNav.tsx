import type { ISocItem } from 'fetch/contact'

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
                {item.type === 'instagram' && (
                  <span className={'block w-8 lg:w-16'}>
                    <img src={'/assets/icons/instagram.svg'} />
                  </span>
                )}
                {item.type === 'tiktok' && (
                  <span className={'block w-8 lg:w-16'}>
                    <img src={'/assets/icons/tikTok.svg'} />
                  </span>
                )}
                {item.type === 'facebook' && (
                  <span className={'block w-8 lg:w-16'}>
                    <img src={'/assets/icons/facebook.svg'} />
                  </span>
                )}
              </Link>
            </li>
          ))}
      </ul>
    </nav>
  )
}
