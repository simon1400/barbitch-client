import type { IFaqItem } from 'fetch/home'

import { LogoIcon } from 'icons/Logo'
import { parseHtml } from 'lib/parseHtml'

import FaqChat from './home/FaqChat'
import { BbLink, SECTION_Y, SectionTitle, WRAP } from './home/ui'

const LogoHand = () => (
  <span className={'flex shrink-0 items-center gap-8 lg:gap-12 pr-8 lg:pr-12'}>
    <LogoIcon className={'h-10 lg:h-[84px] w-auto fill-accent'} />
    <img
      src={'/assets/home/hand-crop.svg'}
      alt={''}
      width={800}
      height={920}
      loading={'lazy'}
      className={'block h-[58px] lg:h-[120px] w-auto'}
    />
  </span>
)

/**
 * „O salonu“ + „Časté dotazy“ (s286). Nahoře běžící řádek „logo + ruka“
 * (dekorace, `aria-hidden`), vlevo text o salonu (`homepage.aboutUs`) se štítkem
 * adresy, vpravo FAQ jako chat. Mobil = jeden sloupec.
 */
const About = ({
  title,
  text,
  faq,
  addressLine,
  hoursLine,
}: {
  title: string
  text: string
  faq: IFaqItem[]
  addressLine: string
  hoursLine: string
}) => {
  return (
    <section aria-labelledby={'o-salonu'} className={`bg-white overflow-hidden ${SECTION_Y}`}>
      <div aria-hidden={'true'} className={'overflow-hidden'}>
        <div
          className={
            'flex w-max items-center animate-[marquee_90s_linear_infinite] motion-reduce:animate-none'
          }
        >
          {Array.from({ length: 8 }, (_, i) => (
            <LogoHand key={i} />
          ))}
        </div>
      </div>

      <div className={`${WRAP} mt-12 lg:mt-[72px] flex flex-wrap gap-14 lg:gap-[88px]`}>
        <div className={'flex-[1_1_420px] min-w-0 flex flex-col gap-6'}>
          <SectionTitle id={'o-salonu'}>{title}</SectionTitle>
          {!!text && (
            <div
              className={
                'text-[16px] lg:text-[18px] leading-[1.6] font-medium [&_p]:m-0 [&_p+p]:mt-6 [&_a]:underline'
              }
            >
              {parseHtml(text)}
            </div>
          )}
          <div className={'flex flex-wrap items-center gap-7'}>
            <BbLink href={'/o-nas'}>{'Poznej náš salon'}</BbLink>
            <p
              className={
                'm-0 mt-2 self-start px-[22px] py-3.5 bg-bb-pink text-[17px] lg:text-[20px] leading-[1.25] font-extrabold -rotate-3'
              }
            >
              {addressLine}
              <br />
              {hoursLine}
            </p>
          </div>
        </div>
        <FaqChat items={faq} />
      </div>
    </section>
  )
}

export default About
