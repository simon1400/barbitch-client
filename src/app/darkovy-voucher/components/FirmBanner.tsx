import { Container } from 'components/Container'
import Link from 'next/link'

/** Odkaz na samostatnou stránku firemních voucherů. */
export const FirmBanner = () => (
  <Container size={'xl'} className={'pt-0 pb-[90px]'}>
    <Link
      href={'/firemni-vouchery'}
      className={
        'group bg-accent text-white grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_auto] gap-7 md:gap-10 items-center p-7 md:p-[40px_48px]'
      }
    >
      <span className={'flex flex-col gap-3'}>
        <span
          className={
            'text-[12px] leading-[15px] font-bold uppercase tracking-[.06em] text-[#fe3a7c]'
          }
        >
          {'Pro firmy'}
        </span>
        <span className={'text-[28px] leading-[32px] md:text-[34px] md:leading-[38px] font-bold'}>
          {'Firemní vouchery od 10 kusů'}
        </span>
        <span className={'text-[16px] leading-[26px] font-medium opacity-75 max-w-[640px]'}>
          {
            'Faktura na firmu, vaše logo na voucheru, hromadné dodání. Zjistěte víc na samostatné stránce.'
          }
        </span>
      </span>
      <span
        className={
          'justify-self-start md:justify-self-end inline-block bg-white text-accent group-hover:text-primary duration-200 uppercase text-xs py-3.5 px-6.5 lg:py-4.5 lg:px-11.5 whitespace-nowrap'
        }
      >
        {'Firemní vouchery →'}
      </span>
    </Link>
  </Container>
)
