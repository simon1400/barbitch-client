'use client'

import { useState } from 'react'

/**
 * Mapa, která se načte až po kliknutí.
 *
 * Vložený `<iframe>` Google Maps stahuje ~800 kB cizího kódu a nastaví cookies
 * Google dřív, než návštěvník vůbec odpoví na lištu se souhlasem. Do kliknutí
 * je tu jen statická zástupná plocha — žádný požadavek ven neodejde.
 */
const ADDRESS = 'Bar.Bitch, Křenová 294/16, 602 00 Brno'
const EMBED_SRC = `https://www.google.com/maps?q=${encodeURIComponent(ADDRESS)}&output=embed&hl=cs`

export const MapEmbed = ({ mapLink }: { mapLink?: string }) => {
  const [loaded, setLoaded] = useState(false)

  return (
    <section className={'mb-16'} aria-labelledby={'jak-k-nam'}>
      <h2 id={'jak-k-nam'} className={'text-lg lg:text-big uppercase mb-6'}>
        {'Jak k nám'}
      </h2>

      <div className={'relative w-full h-[320px] md:h-[420px] overflow-hidden bg-[#161615]'}>
        {loaded ? (
          <iframe
            src={EMBED_SRC}
            title={'Mapa — Barbitch Beauty Studio, Křenová 294/16, Brno'}
            className={'absolute inset-0 w-full h-full border-0'}
            loading={'lazy'}
            referrerPolicy={'no-referrer-when-downgrade'}
            allowFullScreen
          />
        ) : (
          <button
            type={'button'}
            onClick={() => setLoaded(true)}
            className={
              'absolute inset-0 w-full h-full flex flex-col items-center justify-center gap-4 text-white px-6 text-center duration-200 hover:bg-[#252523]'
            }
          >
            <span className={'text-resMd1 md:text-h5 font-bold'}>
              {'Křenová 294/16, 602 00 Brno'}
            </span>
            <span className={'text-xs1 text-[#A0A0A0] max-w-[420px]'}>
              {'Jsme v centru Brna, kousek od Zvonařky. Mapa se načte z Google až po kliknutí.'}
            </span>
            <span className={'bg-primary text-white uppercase text-resXs py-3 px-6 mt-1'}>
              {'Zobrazit mapu'}
            </span>
          </button>
        )}
      </div>

      <p className={'text-xs1 mt-4'}>
        <a
          className={'text-primary underline underline-offset-2 hover:underline-offset-4'}
          href={mapLink || 'https://maps.app.goo.gl/LWngsct3NGv66d986'}
          target={'_blank'}
          rel={'noopener noreferrer'}
        >
          {'Otevřít trasu v Google Maps'}
        </a>
      </p>
    </section>
  )
}
