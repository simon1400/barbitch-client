import type { Metadata } from 'next'

import { Breadcrumbs } from 'components/Breadcrumbs'
import { DynamicContent } from 'components/DynamicContent'
import { VoucherHero } from 'components/vouchers/VoucherHero'
import { getVoucherMeta } from 'fetch/getMeta'
import { getVoucher } from 'fetch/voucher'
import { getVoucherCatalog } from 'fetch/voucherCatalog'
import { BRAND, brandTitle, cmsTitle, ogImages } from 'lib/seo'
import { ProductSchema } from 'schemasOrg/product'

import { FirmBanner } from './components/FirmBanner'
import { VoucherOrder } from './components/VoucherOrder'

export const revalidate = 3600

export async function generateMetadata(): Promise<Metadata> {
  const data = await getVoucherMeta()

  const { title, metaData } = data

  return {
    title: cmsTitle(metaData?.title || title || 'Dárkový voucher do beauty salonu Brno'),
    description: metaData?.description,
    openGraph: {
      title: brandTitle(metaData.title || title),
      description: metaData.description || '',
      siteName: BRAND,
      locale: 'cs_CZ',
      images: ogImages(metaData.image?.url, 'Dárkový voucher Bar.Bitch Brno'),
      url: `https://barbitch.cz/darkovy-voucher`,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: brandTitle(metaData.title || title),
      description: metaData.description || '',
      images: ogImages(metaData.image?.url, 'Dárkový voucher Bar.Bitch Brno'),
    },
    alternates: {
      canonical: `https://barbitch.cz/darkovy-voucher`,
    },
  }
}

const Voucher = async () => {
  const [data, items] = await Promise.all([getVoucher(), getVoucherCatalog()])
  const prices = items.map((i) => i.price)

  return (
    <main>
      <ProductSchema
        name={'Dárkový voucher Bar.Bitch'}
        description={
          'Dárkový voucher do salonu Bar.Bitch v Brně — na konkrétní službu nebo na částku. Ideální dárek pro vaše blízké.'
        }
        url={'https://barbitch.cz/darkovy-voucher'}
        lowPrice={Math.min(...prices)}
        highPrice={Math.max(...prices)}
        offerCount={items.length}
      />
      <VoucherHero
        variant={'pair'}
        kicker={'You rock baby!'}
        title={data.title || 'Dárkový voucher'}
        perex={
          'Na konkrétní službu nebo na částku. Zaplatíte kartou, PDF přijde e-mailem během minuty.'
        }
        cta={{ text: 'Vybrat voucher', href: '#objednavka' }}
      />
      <Breadcrumbs
        items={[
          { name: 'Hlavní strana', url: 'https://barbitch.cz' },
          { name: 'Dárkové vouchery', url: 'https://barbitch.cz/darkovy-voucher' },
        ]}
        next={{ prefix: 'Pro firmy:', label: 'Firemní vouchery', url: '/firemni-vouchery' }}
      />
      <VoucherOrder items={items} />
      <FirmBanner />
      <DynamicContent data={data.dynamicContent} />
    </main>
  )
}

export default Voucher
