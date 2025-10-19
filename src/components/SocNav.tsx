import type { ISocItem } from 'fetch/contact'

import Image from 'next/image'
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
                    <Image
                      src={'/assets/icons/instagram.svg'}
                      alt={'Instagram logo icon'}
                      width={64}
                      height={64}
                      className={'w-8 lg:w-16 h-auto'}
                    />
                  </span>
                )}
                {item.type === 'tiktok' && (
                  <span className={'block w-8 lg:w-16'}>
                    <Image
                      src={'/assets/icons/tikTok.svg'}
                      alt={'TikTok logo icon'}
                      width={64}
                      height={64}
                      className={'w-8 lg:w-16 h-auto'}
                    />
                  </span>
                )}
                {item.type === 'facebook' && (
                  <span className={'block w-8 lg:w-16'}>
                    <Image
                      src={'/assets/icons/facebook.svg'}
                      alt={'Facebook logo icon'}
                      width={64}
                      height={64}
                      className={'w-8 lg:w-16 h-auto'}
                    />
                  </span>
                )}
              </Link>
            </li>
          ))}
      </ul>
    </nav>
  )
}
