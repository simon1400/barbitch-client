import type { Metadata } from 'next'

import { Breadcrumbs } from 'components/Breadcrumbs'
import { Container } from 'components/Container'
import Image from 'components/Image'
import { LogoTag, VoucherHero } from 'components/vouchers/VoucherHero'
import { getContact } from 'fetch/contact'
import { ogImages } from 'lib/seo'
import { VOUCHER_VALID_MONTHS } from 'lib/vouchers'

import { FirmInquiryForm } from './FirmInquiryForm'

export const revalidate = 3600

const PAGE_URL = 'https://barbitch.cz/firemni-vouchery'
const TITLE = 'Firemní dárkové vouchery | Barbitch'
const DESCRIPTION =
  'Dárkové vouchery do beauty salonu Barbitch Brno pro tým, klienty a partnery. Od 10 kusů, na fakturu, s vaším logem, hromadně v PDF nebo tištěné.'

export const metadata: Metadata = {
  // `absolute` — šablona layoutu by přidala druhé „| Barbitch“.
  title: { absolute: TITLE },
  description: DESCRIPTION,
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    siteName: 'Barbitch',
    locale: 'cs_CZ',
    images: ogImages(undefined, 'Firemní dárkové vouchery Barbitch Brno'),
    url: PAGE_URL,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
    images: ogImages(undefined, 'Firemní dárkové vouchery Barbitch Brno'),
  },
  alternates: { canonical: PAGE_URL },
}

const STEPS = [
  {
    title: 'Pošlete poptávku',
    text: 'Počet kusů, hodnota nebo služba, případně logo a věnování.',
  },
  {
    title: 'Potvrdíme cenu a návrh',
    text: 'Do jednoho pracovního dne dostanete kalkulaci a náhled voucheru.',
  },
  {
    title: 'Faktura a dodání',
    text: 'Po úhradě faktury pošleme PDF hromadně nebo tištěné do 2 pracovních dnů.',
  },
]

// Konkrétní slevy se neuvádějí (rozhodnutí majitelky 24. 10. 2026) — přijdou v kalkulaci.
const PRICING = [
  {
    count: '10–19 ks',
    price: 'běžná cena',
    text: 'Vouchery na částku i službu, logo zdarma',
  },
  {
    count: '20–49 ks',
    price: 'množstevní sleva',
    text: 'Výši slevy uvedeme v kalkulaci',
  },
  {
    count: '50+ ks',
    price: 'individuálně',
    text: 'Osobní nabídka, tištěné vouchery v ceně',
  },
]

const blockTitle = 'text-[28px] leading-[32px] md:text-[34px] md:leading-[35px] font-bold mb-4'

const Preview = ({ src, label }: { src: string; label: string }) => (
  <figure className={'w-[160px] sm:w-[220px]'}>
    {/* Celý voucher na výšku (šablona 238 × 522 pt). */}
    <div
      className={
        'relative aspect-[238/522] overflow-hidden bg-primary shadow-[0_20px_40px_rgba(0,0,0,.18)]'
      }
    >
      <Image src={src} alt={''} fill sizes={'220px'} className={'object-cover'} />
      <LogoTag small />
    </div>
    <figcaption className={'mt-3 text-[14px] leading-[20px] font-medium text-[#444]'}>
      {label}
    </figcaption>
  </figure>
)

const FirmVouchers = async () => {
  const contact = await getContact()

  return (
    <main>
      <VoucherHero
        variant={'logo'}
        kicker={'Pro firmy · od 10 kusů'}
        title={'Firemní vouchery'}
        perex={
          'Dárek pro tým, klienty a partnery. Na fakturu, s vaším logem, hromadně v PDF nebo tištěné.'
        }
        cta={{ text: 'Poslat poptávku', href: '#poptavka' }}
      />
      <Breadcrumbs
        items={[
          { name: 'Hlavní strana', url: 'https://barbitch.cz' },
          { name: 'Dárkové vouchery', url: 'https://barbitch.cz/darkovy-voucher' },
          { name: 'Firemní vouchery', url: PAGE_URL },
        ]}
        back={{ label: 'Zpět na dárkové vouchery', url: '/darkovy-voucher' }}
      />

      <Container size={'xl'}>
        <div
          className={
            'grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_520px] gap-14 lg:gap-20 items-start mb-[90px]'
          }
        >
          <div className={'flex flex-col gap-14'}>
            <section aria-labelledby={'jak-to-funguje'}>
              <h2 id={'jak-to-funguje'} className={blockTitle}>
                {'Jak to funguje'}
              </h2>
              <ol className={'grid grid-cols-1 md:grid-cols-3 gap-8'}>
                {STEPS.map((step, index) => (
                  <li key={step.title} className={'border-t-[1.5px] border-[#1616154D] pt-[18px]'}>
                    <span
                      className={'block text-[14px] leading-[20px] font-bold text-primary mb-2'}
                    >
                      {`0${index + 1}`}
                    </span>
                    <h3 className={'text-[20px] leading-[25px] font-bold mb-2'}>{step.title}</h3>
                    <p className={'text-[15px] leading-[24px] font-medium text-[#444]'}>
                      {step.text}
                    </p>
                  </li>
                ))}
              </ol>
            </section>

            <section aria-labelledby={'mnozstvi-a-cena'}>
              <h2 id={'mnozstvi-a-cena'} className={blockTitle}>
                {'Množství a cena'}
              </h2>
              <dl className={'border-t-[1.5px] border-[#1616154D]'}>
                {PRICING.map((row) => (
                  <div
                    key={row.count}
                    className={
                      'grid grid-cols-[110px_minmax(0,1fr)] md:grid-cols-[140px_160px_minmax(0,1fr)] gap-x-6 gap-y-1 py-[18px] border-b-[1.5px] border-[#1616154D]'
                    }
                  >
                    <dt className={'text-[20px] leading-[24px] font-bold row-span-2 md:row-span-1'}>
                      {row.count}
                    </dt>
                    <dd className={'text-[16px] leading-[24px] font-bold text-primary'}>
                      {row.price}
                    </dd>
                    <dd className={'text-[15px] leading-[24px] font-medium text-[#444]'}>
                      {row.text}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>

            <section aria-labelledby={'jak-voucher-vypada'}>
              <h2 id={'jak-voucher-vypada'} className={blockTitle}>
                {'Jak voucher vypadá'}
              </h2>
              <p
                className={'text-[16px] leading-[26px] font-medium text-[#444] max-w-[620px] mb-8'}
              >
                {`Na částku nebo na konkrétní službu. Do pravého horního rohu doplníme logo vaší firmy, dolů věnování. Každý voucher má unikátní kód a platí ${VOUCHER_VALID_MONTHS} měsíců.`}
              </p>
              <div className={'flex flex-wrap gap-6 sm:gap-8'}>
                <Preview src={'/assets/vouchers/v1000.png'} label={'Voucher na částku'} />
                <Preview src={'/assets/vouchers/sluzba.png'} label={'Voucher na službu'} />
              </div>
            </section>
          </div>

          <FirmInquiryForm email={contact.email} phone={contact.phone} />
        </div>
      </Container>
    </main>
  )
}

export default FirmVouchers
