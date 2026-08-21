import type { Metadata } from 'next'

import { DynamicContent } from 'components/DynamicContent'
import { getLinkToReserve } from 'fetch/contact'
import { getVoucherMeta } from 'fetch/getMeta'
import { getVoucher } from 'fetch/voucher'
import { cmsTitle, ogImages } from 'lib/seo'
import { BreadcrumbSchema } from 'schemasOrg/breadcrumb'
import { ProductSchema } from 'schemasOrg/product'
import { Top } from 'sections/Top/Top'

import VoucherForm from './VoucherForm'

export const revalidate = 3600

export async function generateMetadata(): Promise<Metadata> {
  const data = await getVoucherMeta()

  const { title, metaData } = data

  return {
    title: cmsTitle(metaData?.title || title || 'Dárkový voucher do beauty salonu Brno'),
    description: metaData?.description,
    openGraph: {
      title: metaData.title || title,
      description: metaData.description || '',
      siteName: 'Barbitch',
      locale: 'cs_CZ',
      images: ogImages(metaData.image?.url, 'Dárkový voucher Barbitch Brno'),
      url: `https://barbitch.cz/darkovy-voucher`,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: metaData.title || title,
      description: metaData.description || '',
      images: ogImages(metaData.image?.url, 'Dárkový voucher Barbitch Brno'),
    },
    alternates: {
      canonical: `https://barbitch.cz/darkovy-voucher`,
    },
  }
}

const Voucher = async () => {
  const [data, dataLink] = await Promise.all([getVoucher(), getLinkToReserve()])

  return (
    <main>
      <BreadcrumbSchema
        items={[
          { name: 'Hlavní strana', url: 'https://barbitch.cz' },
          { name: 'Dárkový voucher', url: 'https://barbitch.cz/darkovy-voucher' },
        ]}
      />
      <ProductSchema
        name={'Dárkový voucher Barbitch'}
        description={
          'Dárkový voucher do Barbitch Beauty Studia v Brně. Ideální dárek pro vaše blízké.'
        }
        url={'https://barbitch.cz/darkovy-voucher'}
        lowPrice={500}
        highPrice={2000}
        offerCount={4}
      />
      <Top title={data.title} small linkToReserve={dataLink.linkToReserve} />
      <VoucherForm />
      <DynamicContent data={data.dynamicContent} />
    </main>
  )
}

export default Voucher
