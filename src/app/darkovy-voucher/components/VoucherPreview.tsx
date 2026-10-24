import type { VoucherItem } from 'lib/vouchers'

import Image from 'components/Image'
import { getStrapiImageUrl } from 'lib/image-utils'

// Fotka pod vouchery na částku — stejná jako v heru.
const AMOUNT_BACKGROUND = '/assets/banner.jpg'

/**
 * Náhled voucheru ve stylu heru: fotka černobíle v režimu multiply na růžové,
 * přechod zleva, vlevo dole bílý nadpis. Služba — fotka procedury a název
 * služby; částka — fotka z heru a „Na částku“ (číslo je na voucheru, neopakuje se).
 * V souhrnu (`large`) je vpravo celý voucher, natočený jako v heru.
 */
export const VoucherPreview = ({
  item,
  large = false,
}: {
  item: VoucherItem
  /** Souhrn objednávky — vyšší plocha, celý voucher vpravo, dole místo pro pruh „Pro / Od“. */
  large?: boolean
}) => {
  const amount = item.kind === 'castka'
  const photo = amount ? AMOUNT_BACKGROUND : item.photo

  return (
    <span
      className={`relative flex items-end overflow-hidden bg-primary text-white ${
        large ? 'h-[320px] pb-[66px]' : 'h-[220px]'
      }`}
    >
      {!!photo && (
        <Image
          src={getStrapiImageUrl(photo)}
          alt={''}
          fill
          sizes={large ? '(max-width: 1024px) 100vw, 460px' : '(max-width: 768px) 100vw, 460px'}
          className={'object-cover object-center grayscale mix-blend-multiply'}
        />
      )}
      <span
        aria-hidden={'true'}
        className={
          'absolute inset-0 bg-[linear-gradient(90deg,rgba(231,30,110,.9)_0%,rgba(231,30,110,.55)_55%,rgba(231,30,110,.2)_100%)]'
        }
      />

      {large && (
        <span
          aria-hidden={'true'}
          className={
            'absolute top-5 right-6 md:right-7 w-[100px] md:w-[108px] aspect-[238/522] rotate-[6deg] shadow-[0_20px_40px_rgba(0,0,0,.35)]'
          }
        >
          <Image src={item.image} alt={''} fill sizes={'108px'} className={'object-cover'} />
        </span>
      )}

      <span
        className={`relative block ${
          large
            ? 'px-7 max-w-[calc(100%-140px)] md:max-w-[calc(100%-150px)]'
            : 'px-[26px] pb-[22px]'
        }`}
      >
        <span
          className={'block text-[12px] leading-[15px] font-bold uppercase tracking-[.14em] mb-2'}
        >
          {amount ? 'Dárkový voucher' : `${item.tag} · dárkový voucher`}
        </span>
        <span
          className={`block font-bold uppercase ${
            large
              ? 'text-[28px] leading-[30px] md:text-[34px] md:leading-[34px]'
              : 'text-[30px] leading-[30px]'
          }`}
        >
          {amount ? 'Na částku' : item.name}
        </span>
      </span>
    </span>
  )
}
