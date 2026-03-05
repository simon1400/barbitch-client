import type { Metadata } from 'next'

import { DynamicContent } from 'components/DynamicContent'
import { getLinkToReserve } from 'fetch/contact'
import { getVoucherMeta } from 'fetch/getMeta'
import { getVoucher } from 'fetch/voucher'
import { getStrapiImageUrl } from 'lib/image-utils'
import { BreadcrumbSchema } from 'schemasOrg/breadcrumb'
import { ProductSchema } from 'schemasOrg/product'
import { Top } from 'sections/Top/Top'

import VoucherForm from './VoucherForm'

export const revalidate = 3600

export async function generateMetadata(): Promise<Metadata> {
  const data = await getVoucherMeta()

  const { title, metaData } = data

  return {
    title: metaData?.title || title,
    description: metaData?.description,
    openGraph: {
      title: metaData.title || title,
      description: metaData.description || '',
      siteName: 'Barbitch',
      images: [getStrapiImageUrl(metaData.image?.url)],
      url: `https://barbitch.cz/darkovy-voucher`,
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: metaData.title || title,
      description: metaData.description || '',
      images: [getStrapiImageUrl(metaData.image?.url)],
    },
    keywords: [
      'barbitch',
      'dárkový voucher',
      'dárkový poukaz',
      'dárek',
      'manikúra',
      'řasy',
      'obočí',
      'Brno',
    ],
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
      />
      <Top title={data.title} small linkToReserve={dataLink.linkToReserve} />
      <VoucherForm />
      <DynamicContent data={data.dynamicContent} />
    </main>
  )
}

export default Voucher
