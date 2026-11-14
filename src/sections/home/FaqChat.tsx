import type { IFaqItem } from 'fetch/home'

import { parseHtml } from 'lib/parseHtml'

import OpenChatButton from './OpenChatButton'

/**
 * „Časté dotazy“ jako chat (s286): otázka — H3 v růžové bublině vpravo, odpověď
 * na černé vlevo. Odpovědi už mají doplněné ceny (lib/homeContent `fillFaqAnswer`).
 * Totéž jde do JSON-LD `FAQPage` na stránce.
 */
const FaqChat = ({ items }: { items: IFaqItem[] }) => {
  if (!items.length) return null
  return (
    <div className={'flex-[1_1_460px] min-w-0 flex flex-col gap-3'}>
      <h2
        id={'caste-dotazy'}
        className={'m-0 mb-3 text-[28px] lg:text-[36px] leading-none font-extrabold uppercase'}
      >
        {'Časté dotazy'}
      </h2>
      {items.map((item) => (
        <div key={item.title} className={'flex flex-col gap-3'}>
          <h3
            className={
              'm-0 self-end max-w-[86%] lg:max-w-[78%] px-5 py-3.5 bg-bb-pink text-[16px] lg:text-[18px] leading-[1.3] font-extrabold'
            }
          >
            {item.title}
          </h3>
          <div
            className={
              'mb-2.5 self-start max-w-[90%] lg:max-w-[82%] px-5 py-3.5 bg-accent text-white text-[15px] lg:text-[16px] leading-[1.5] [&_p]:m-0 [&_p+p]:mt-2 [&_a]:text-white [&_a]:underline'
            }
          >
            {parseHtml(item.content, false)}
          </div>
        </div>
      ))}
      <div
        className={
          'mt-2 flex flex-wrap items-center justify-between gap-3 py-3.5 pr-3.5 pl-5 border-[3px] border-solid border-accent'
        }
      >
        <p className={'m-0 text-[17px] font-bold'}>{'Máš jinou otázku?'}</p>
        <OpenChatButton />
      </div>
    </div>
  )
}

export default FaqChat
