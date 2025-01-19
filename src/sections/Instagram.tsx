import { InstaBaseIcon } from 'icons/InstaBase'
import { ReelsIcon } from 'icons/Reels'
import Image from 'next/image'
import Link from 'next/link'
interface IInstagramItem {
  type: 'CAROUSEL_ALBUM' | 'IMAGE' | 'VIDEO'
  previewUrl: string
  link: string
}

export const Instagram = ({ data }: { data: IInstagramItem[] }) => {
  return (
    <section>
      <h2 className={'text-lg lg:text-big uppercase mt-10 lg:mt-20 text-center -mb-1'}>
        {'Follow'}
      </h2>
      <div className={'grid grid-cols-3 lg:grid-cols-6 grid-rows-2 lg:grid-rows-1 gap-1'}>
        {data.splice(0, 6).map((item) => (
          <Link
            href={item.link}
            target={'_blank'}
            className={'block relative w-full pt-[100%] overflow-hidden scale-100 hover:scale-95 duration-200'}
            key={item.previewUrl}
          >
            <span className={'absolute top-2 right-2 z-20 w-6 fill-white'}>
              {item.type === 'VIDEO' ? <ReelsIcon /> : <InstaBaseIcon />}
            </span>
            <Image className={'object-cover'} src={item.previewUrl} fill alt={'Imstagram img'} />
          </Link>
        ))}
      </div>
    </section>
  )
}
