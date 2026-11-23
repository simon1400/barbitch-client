'use client'
import type { VoucherItem } from 'lib/vouchers'
import type { ReactNode } from 'react'

import Alert from 'components/Alert'
import { formatKc, VOUCHER_VALID_MONTHS } from 'lib/vouchers'
import { LoaderCircle } from 'lucide-react'

import { VoucherPreview } from './VoucherPreview'

const Row = ({ label, children }: { label: string; children: ReactNode }) => (
  <div className={'flex justify-between gap-4 border-t-[1.5px] border-white/20 pt-4'}>
    <span className={'opacity-70'}>{label}</span>
    <span className={'text-right font-semibold'}>{children}</span>
  </div>
)

/** „Změnit“ — zpět do katalogu (skupinu na telefonu přepne VoucherOrder). */
export const ChangeLink = ({ onClick }: { onClick: () => void }) => (
  <button
    type={'button'}
    onClick={onClick}
    className={
      'shrink-0 text-[12px] leading-[15px] font-bold uppercase tracking-[.06em] underline underline-offset-4 hover:text-[#fe3a7c] duration-200'
    }
  >
    {'Změnit'}
  </button>
)

/** Sticky souhrn objednávky: náhled, voucher, cena a tlačítko platby. */
export const OrderSummary = ({
  item,
  forName,
  fromName,
  formId,
  loading,
  error,
  onChangeVoucher,
}: {
  item: VoucherItem
  forName: string
  fromName: string
  formId: string
  loading: boolean
  /** Chyba objednávky (server neotevřel platbu) — text pod tlačítkem. */
  error: string | null
  onChangeVoucher: () => void
}) => (
  <aside aria-label={'Souhrn objednávky'} className={'lg:sticky lg:top-6 self-start'}>
    <div className={'relative overflow-hidden bg-primary'}>
      <VoucherPreview item={item} large />
      <p
        className={
          'absolute inset-x-0 bottom-0 bg-[rgba(22,22,21,.85)] text-white p-[14px_20px] text-[14px] leading-[20px] font-medium'
        }
      >
        {'Pro: '}
        <b>{forName.trim() || 'Anna'}</b>
        {' · Od: '}
        <b>{fromName.trim() || 'Petr'}</b>
      </p>
    </div>

    <div className={'bg-accent text-white p-[28px_28px_26px] flex flex-col gap-[18px]'}>
      <div className={'flex justify-between items-start gap-4'}>
        <div>
          <p
            className={
              'text-[12px] leading-[15px] font-bold uppercase tracking-[.06em] text-[#fe3a7c] mb-2'
            }
          >
            {'Vaše objednávka'}
          </p>
          <p className={'text-[16px] leading-[22px] font-bold'}>{item.title}</p>
          <p className={'text-[14px] leading-[20px] font-medium opacity-70'}>
            {item.kind === 'sluzba'
              ? `${item.tag} · na jednu návštěvu`
              : 'Na libovolnou službu z ceníku'}
          </p>
        </div>
        <ChangeLink onClick={onChangeVoucher} />
      </div>

      <div className={'flex flex-col gap-4 text-[14px] leading-[22px]'}>
        <Row label={'Doručení'}>{'E-mailem (PDF), zdarma'}</Row>
        <Row label={'Platnost'}>{`${VOUCHER_VALID_MONTHS} měsíců`}</Row>
        <Row label={'Kód voucheru'}>
          <span className={'font-mono font-normal'}>{'vygeneruje se po platbě'}</span>
        </Row>
        <div
          className={
            'flex justify-between items-baseline gap-4 border-t-[1.5px] border-white/20 pt-4'
          }
        >
          <span className={'text-[16px] font-bold'}>{'Celkem'}</span>
          <span className={'text-[32px] leading-[36px] font-bold'}>{formatKc(item.price)}</span>
        </div>
      </div>

      {error && <Alert state={'error'} title={'Platbu se nepodařilo zahájit.'} text={error} />}
      <button
        type={'submit'}
        form={formId}
        disabled={loading}
        className={`h-[57px] w-full bg-[#fe3a7c] hover:bg-primary text-white text-xs uppercase duration-200 ${
          loading ? 'cursor-wait' : 'cursor-pointer'
        }`}
      >
        {loading ? (
          <LoaderCircle
            className={'animate-spin w-7 h-7 mx-auto'}
            aria-label={'Přesměrování na platební bránu'}
          />
        ) : (
          'Zaplatit kartou →'
        )}
      </button>
      <p
        className={
          'text-[11px] leading-[14px] font-bold uppercase tracking-[.06em] opacity-60 text-center'
        }
      >
        {'Comgate · Visa · Mastercard · Apple Pay · Google Pay'}
      </p>
    </div>
  </aside>
)
