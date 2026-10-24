import Button from 'components/Button'
import { Container } from 'components/Container'
import Image from 'components/Image'

const voucherShadow = 'shadow-[0_30px_60px_rgba(0,0,0,.4)]'

/** Štítek „Vaše logo“ v pravém horním rohu náhledu (firemní vouchery). */
export const LogoTag = ({ small = false }: { small?: boolean }) => (
  <span
    className={`absolute top-0 right-0 bg-accent text-white font-bold uppercase tracking-[.1em] ${
      small ? 'text-[10px] leading-[13px] p-[6px_8px]' : 'text-[11px] leading-[14px] p-[8px_10px]'
    }`}
  >
    {'Vaše logo'}
  </span>
)

/**
 * Hero stránek s vouchery: růžová plocha, fotka v režimu multiply, přechod
 * zleva, vpravo náhledy voucheru. Hlavička webu je na něm bílá (viz
 * `isPinkHeroPage`).
 */
export const VoucherHero = ({
  kicker,
  title,
  perex,
  cta,
  variant,
}: {
  kicker: string
  title: string
  perex: string
  cta: { text: string; href: string }
  /** `pair` — dva vouchery přes sebe, `logo` — jeden se štítkem „Vaše logo“. */
  variant: 'pair' | 'logo'
}) => (
  <section
    aria-labelledby={'top-title'}
    className={
      'relative z-10 h-[600px] md:h-[640px] flex items-end overflow-hidden bg-primary text-white'
    }
  >
    <div aria-hidden={'true'} className={'absolute inset-0'}>
      <Image
        src={'/assets/banner.jpg'}
        alt={''}
        fill
        priority
        sizes={'100vw'}
        className={'object-cover object-center grayscale mix-blend-multiply'}
      />
      <div
        className={
          'absolute inset-0 bg-[linear-gradient(90deg,rgba(231,30,110,.9)_0%,rgba(231,30,110,.55)_55%,rgba(231,30,110,.2)_100%)]'
        }
      />
    </div>

    <Container size={'xl'} className={'relative h-full'}>
      {/* Náhledy voucheru — čistě dekorace, text je v PDF. */}
      <div
        aria-hidden={'true'}
        className={'absolute top-[92px] right-4 md:top-[110px] md:right-[4%] lg:right-[7%]'}
      >
        {variant === 'pair' && (
          <div
            className={`hidden md:block absolute top-[34px] right-[150px] lg:right-[190px] w-[210px] lg:w-[230px] aspect-[238/522] -rotate-[8deg] brightness-[.94] ${voucherShadow}`}
          >
            <Image src={'/assets/vouchers/v1000.png'} alt={''} fill sizes={'230px'} />
          </div>
        )}
        <div
          className={`relative w-[112px] md:w-[210px] lg:w-[230px] aspect-[238/522] rotate-[6deg] ${voucherShadow}`}
        >
          <Image
            src={`/assets/vouchers/${variant === 'logo' ? 'sluzba' : 'v1000'}.png`}
            alt={''}
            fill
            sizes={'(max-width: 768px) 112px, 230px'}
          />
          {variant === 'logo' && <LogoTag />}
        </div>
      </div>

      <div className={'absolute bottom-0 left-2 right-2 md:left-4 md:right-4 pb-10 md:pb-16'}>
        <div className={'max-w-[620px]'}>
          <p
            className={
              'text-[13px] leading-[17px] md:text-[14px] md:leading-[18px] font-bold uppercase tracking-[.14em] mb-3'
            }
          >
            {kicker}
          </p>
          <h1
            id={'top-title'}
            className={
              'text-[44px] leading-[44px] md:text-[72px] md:leading-[70px] xl:text-[91px] xl:leading-[88px] font-bold uppercase mb-5'
            }
          >
            {title}
          </h1>
          <p
            className={
              'text-[17px] leading-[26px] md:text-[20px] md:leading-[30px] font-medium max-w-[460px] mb-7'
            }
          >
            {perex}
          </p>
          <Button text={cta.text} href={cta.href} />
        </div>
      </div>
    </Container>
  </section>
)
