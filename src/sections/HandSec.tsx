import type { IHomeService, IServicePrices } from 'fetch/home'

import { formatKc, HOME_SERVICES } from 'lib/homeContent'
import Link from 'next/link'

import { BbLink, SECTION_Y, SectionTitle, Sparkle, WRAP } from './home/ui'

type Slug = keyof typeof HOME_SERVICES

/**
 * „Co u nás uděláme“ (s286): růžová sekce, uprostřed firemní ruka, kolem tři
 * služby webu. Popis z `service.homeText` (Strapi), cena „od“ z enginu
 * (/api/engine/home/service-prices), odkaz s klíčovou kotvou na /service/<slug>.
 */
const HandSec = ({
  title,
  services,
  prices,
}: {
  title: string
  services: IHomeService[]
  prices: IServicePrices
}) => {
  const bySlug = new Map(services.map((s) => [s.slug, s]))
  const block = (slug: Slug, className = '') => {
    const meta = HOME_SERVICES[slug]
    const cms = bySlug.get(slug)
    const price = prices[slug]
    return (
      <article className={`flex flex-col gap-2.5 max-w-[360px] ${className}`}>
        <h3 className={'m-0 text-[26px] lg:text-[38px] leading-none font-extrabold uppercase'}>
          {meta.heading}
        </h3>
        <p className={'m-0 text-[15px] lg:text-[17px] leading-[1.5] font-medium'}>
          {cms?.homeText?.trim() || meta.text}
        </p>
        {typeof price === 'number' && price > 0 && (
          <p className={'m-0 text-[16px] lg:text-[20px] font-extrabold'}>
            {`${meta.pricePrefix} ${formatKc(price)}`}
          </p>
        )}
        <Link
          href={`/service/${cms?.slug || slug}`}
          className={
            'self-start py-2.5 text-[15px] font-extrabold text-accent underline underline-offset-4 hover:underline-offset-[6px] hover:text-accent [transition-duration:200ms]'
          }
        >
          {meta.anchor}
        </Link>
      </article>
    )
  }

  return (
    <section
      aria-labelledby={'co-u-nas'}
      className={`relative overflow-hidden bg-bb-pink ${SECTION_Y}`}
    >
      <Sparkle size={22} className={'top-[60px] left-[88%]'} />
      <Sparkle
        size={14}
        opacity={0.75}
        className={'top-[30%] left-[84%] lg:top-[80%] lg:left-[62%]'}
      />
      <div className={WRAP}>
        <SectionTitle id={'co-u-nas'}>{title}</SectionTitle>

        {/* Mobil: ruka, Manikúra, Řasy, Obočí, tlačítko. Desktop: 3 sloupce. */}
        <div
          className={'mt-8 flex flex-col gap-8 lg:grid lg:grid-cols-3 lg:gap-10 lg:items-center'}
        >
          <div className={'contents lg:flex lg:flex-col lg:gap-[72px]'}>
            {block('manikura', 'order-2 lg:order-none')}
            {block('oboci', 'order-4 lg:order-none')}
          </div>
          <img
            src={'/assets/home/hand-crop.svg'}
            alt={'Ruka s dlouhými nehty, symbol salonu Barbitch'}
            width={800}
            height={920}
            loading={'lazy'}
            className={
              'order-1 lg:order-none block w-[240px] lg:w-full max-w-[440px] h-auto self-center lg:justify-self-center'
            }
          />
          <div className={'contents lg:flex lg:flex-col lg:gap-10'}>
            {block('rasy', 'order-3 lg:order-none')}
            <div className={'order-5 lg:order-none'}>
              <BbLink href={'/cenik'} className={'w-full lg:w-auto'}>
                {'Celý ceník'}
              </BbLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HandSec
