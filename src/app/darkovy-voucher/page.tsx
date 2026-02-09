import type { Metadata } from 'next'

import { DynamicContent } from 'components/DynamicContent'
import { getLinkToReserve } from 'fetch/contact'
import { getVoucherMeta } from 'fetch/getMeta'
import { getVoucher } from 'fetch/voucher'
import { getStrapiImageUrl } from 'lib/image-utils'
import { Top } from 'sections/Top/Top'

import VoucherForm from './VoucherForm'

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
    alternates: {
      canonical: `https://barbitch.cz/darkovy-voucher`,
    },
  }
}

const Voucher = async () => {
  const data = await getVoucher()
  const dataLink = await getLinkToReserve()

  return (
    <main>
      <Top title={data.title} small linkToReserve={dataLink.linkToReserve} />
      <VoucherForm />
      <DynamicContent data={data.dynamicContent} />
    </main>
  )
}

export default Voucher
