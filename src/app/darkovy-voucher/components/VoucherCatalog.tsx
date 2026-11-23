'use client'
import type { VoucherItem, VoucherKind } from 'lib/vouchers'

import { Container } from 'components/Container'
import Image from 'components/Image'
import { formatKc } from 'lib/vouchers'

import { VoucherPreview } from './VoucherPreview'

const cardShadow = 'shadow-[0_10px_15px_-3px_rgba(0,0,0,.08),0_4px_6px_-4px_rgba(0,0,0,.08)]'

const outlineCls = (selected: boolean) =>
  `outline outline-[3px] transition-[outline-color] duration-200 ${
    selected ? 'outline-primary' : 'outline-transparent hover:outline-primary'
  } focus-visible:outline-primary`

const SectionHead = ({ id, title, note }: { id: string; title: string; note: string }) => (
  <div className={'flex flex-col md:flex-row md:justify-between md:items-end gap-2 md:gap-8 mb-7'}>
    <h2 id={id} className={'text-[28px] leading-[32px] md:text-[34px] md:leading-[35px] font-bold'}>
      {title}
    </h2>
    <p className={'text-[14px] leading-[24px] font-medium text-[#767676] md:text-right'}>{note}</p>
  </div>
)

/** Tlačítko karty: tmavé „Vybrat“, po výběru růžové „Vybráno“ (celá karta je <button>). */
const SelectButton = ({ selected, full = false }: { selected: boolean; full?: boolean }) => (
  <span
    className={`text-[12px] leading-[15px] font-bold uppercase text-white duration-200 ${
      full ? 'flex items-center justify-center w-full h-full' : 'px-5 py-3'
    } ${selected ? 'bg-primary' : 'bg-accent group-hover:bg-primary'}`}
  >
    {selected ? 'Vybráno' : 'Vybrat'}
  </span>
)

const ServiceCard = ({
  item,
  selected,
  onSelect,
}: {
  item: VoucherItem
  selected: boolean
  onSelect: () => void
}) => (
  <button
    type={'button'}
    aria-pressed={selected}
    onClick={onSelect}
    className={`group text-left bg-white flex flex-col ${cardShadow} ${outlineCls(selected)}`}
  >
    <VoucherPreview item={item} />
    <span className={'flex flex-col gap-2.5 flex-1 p-[22px_26px_26px]'}>
      <span className={'text-[16px] leading-[26px] font-medium text-[#444] mb-3'}>{item.desc}</span>
      <span
        className={
          'mt-auto flex justify-between items-center gap-4 border-t-[1.5px] border-[#1616154D] pt-4'
        }
      >
        <span className={'text-[26px] leading-[30px] font-bold'}>{formatKc(item.price)}</span>
        <SelectButton selected={selected} />
      </span>
    </span>
  </button>
)

const AmountTile = ({
  item,
  selected,
  onSelect,
}: {
  item: VoucherItem
  selected: boolean
  onSelect: () => void
}) => (
  <button
    type={'button'}
    aria-pressed={selected}
    onClick={onSelect}
    className={`group text-left bg-white flex flex-col ${cardShadow} ${outlineCls(selected)}`}
  >
    {/* Voucher na celou šířku, oříznutý pod „GIFT CARD“ (bez rámečku „pro:“
        a řádků platnosti) — šablona 238 × 522 pt, výřez do 386 pt. */}
    <span className={'relative block aspect-[238/386] overflow-hidden bg-primary'}>
      <Image
        src={item.image}
        alt={''}
        fill
        sizes={'(max-width: 1024px) 50vw, 340px'}
        className={'object-cover object-top'}
      />
    </span>
    <span className={'sr-only'}>{item.title}</span>
    {/* Částka je na voucheru samotném (a v sr-only názvu) — dole jen akce přes celou
        šířku. Pevná výška, aby výběr nezvýšil celou řadu dlaždic. */}
    <span className={'block h-[52px]'}>
      <SelectButton selected={selected} full />
    </span>
  </button>
)

/**
 * Přepínač druhu voucheru — jen na telefonu (md:hidden). Heatmapy ukázaly, že na
 * telefonu lidé dlouho scrollují přes vouchery na službu a k voucherům na částku
 * se nedostanou; proto telefon ukazuje vždy jen jednu skupinu, výchozí „na částku“.
 * Na počítači jsou vidět obě sekce pod sebou jako dřív.
 */
const KindSwitch = ({ tab, onTab }: { tab: VoucherKind; onTab: (kind: VoucherKind) => void }) => (
  <div className={'md:hidden grid grid-cols-2 border-[1.5px] border-accent mb-8'}>
    {(
      [
        ['castka', 'Na částku'],
        ['sluzba', 'Na službu'],
      ] as const
    ).map(([kind, label]) => (
      <button
        key={kind}
        type={'button'}
        aria-pressed={tab === kind}
        aria-controls={kind === 'castka' ? 'voucher-na-castku' : 'voucher-na-sluzbu'}
        onClick={() => onTab(kind)}
        className={`h-12 text-[12px] leading-[15px] font-bold uppercase duration-200 ${
          tab === kind ? 'bg-accent text-white' : 'bg-white text-accent'
        }`}
      >
        {label}
      </button>
    ))}
  </div>
)

export const VoucherCatalog = ({
  items,
  selectedId,
  onSelect,
  tab,
  onTab,
}: {
  items: VoucherItem[]
  selectedId: string
  onSelect: (id: string) => void
  /** Skupina zobrazená na telefonu. */
  tab: VoucherKind
  onTab: (kind: VoucherKind) => void
}) => {
  const services = items.filter((i) => i.kind === 'sluzba')
  const amounts = items.filter((i) => i.kind === 'castka')
  const hiddenOnPhone = (kind: VoucherKind) =>
    services.length > 0 && tab !== kind ? 'max-md:hidden' : ''

  return (
    <Container size={'xl'}>
      <div id={'vouchery'} className={'scroll-mt-6'}>
        {services.length > 0 && <KindSwitch tab={tab} onTab={onTab} />}
      </div>
      {services.length > 0 && (
        <section
          id={'voucher-na-sluzbu'}
          aria-labelledby={'voucher-sluzba-title'}
          className={`mb-[70px] scroll-mt-6 ${hiddenOnPhone('sluzba')}`}
        >
          <SectionHead
            id={'voucher-sluzba-title'}
            title={'Voucher na službu'}
            note={'Nejčastější dárek. Obdarovaná si jen rezervuje termín.'}
          />
          <div className={'grid grid-cols-1 md:grid-cols-3 gap-6'}>
            {services.map((item) => (
              <ServiceCard
                key={item.id}
                item={item}
                selected={item.id === selectedId}
                onSelect={() => onSelect(item.id)}
              />
            ))}
          </div>
        </section>
      )}

      <section
        id={'voucher-na-castku'}
        aria-labelledby={'voucher-castka-title'}
        className={`mb-[90px] scroll-mt-6 ${hiddenOnPhone('castka')}`}
      >
        <SectionHead
          id={'voucher-castka-title'}
          title={'Voucher na částku'}
          note={'Obdarovaná si vybere službu sama. Lze kombinovat s ceníkem.'}
        />
        <div className={'grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6'}>
          {amounts.map((item) => (
            <AmountTile
              key={item.id}
              item={item}
              selected={item.id === selectedId}
              onSelect={() => onSelect(item.id)}
            />
          ))}
        </div>
      </section>
    </Container>
  )
}
