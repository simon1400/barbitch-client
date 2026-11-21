import type { Metadata } from 'next'

import { Breadcrumbs } from 'components/Breadcrumbs'
import { DynamicContent } from 'components/DynamicContent'
import { getArticle } from 'fetch/article'
import { getLinkToReserve } from 'fetch/contact'
import { Axios } from 'lib/api'
import { getStrapiImageUrl } from 'lib/image-utils'
import { BRAND, brandTitle, cmsTitle, ogImages } from 'lib/seo'
import { notFound } from 'next/navigation'
import { WebPageSchema } from 'schemasOrg/webPage'
import { Top } from 'sections/Top/Top'

// Bez toho se stránka vygeneruje jednou při buildu a v Strapi upravený text
// se na produkci neobjeví až do dalšího nasazení (prod vracel s-maxage=31536000).
export const revalidate = 3600

export async function generateStaticParams() {
  try {
    const articles = (await Axios.get('/api/articles?fields[0]=slug')) as {
      slug: string
    }[]
    return articles.map((article) => ({
      article: article.slug,
    }))
  } catch {
    return []
  }
}

export async function generateMetadata({ params }: any): Promise<Metadata> {
  const { article } = await params
  const data = await getArticle(article)

  if (!data) {
    // Neexistující slug končí `notFound()` — metadata to musí potvrdit,
    // jinak 404 zdědí `index: true` z rootu.
    return {
      title: { absolute: 'Stránka nenalezena (404) | Bar.Bitch' },
      description: '',
      robots: { index: false, follow: false },
    }
  }

  const { title, metaData } = data

  return {
    title: cmsTitle(metaData?.title || title),
    description: metaData?.description,
    openGraph: {
      title: brandTitle(metaData?.title || title),
      description: metaData?.description || '',
      siteName: BRAND,
      locale: 'cs_CZ',
      images: ogImages(metaData?.image?.url, `${title} — Bar.Bitch Brno`),
      url: `https://barbitch.cz/${article}`,
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: brandTitle(metaData?.title || title),
      description: metaData?.description || '',
      images: ogImages(metaData?.image?.url, `${title} — Bar.Bitch Brno`),
    },
    alternates: {
      canonical: `https://barbitch.cz/${article}`,
    },
  }
}

const Article = async ({ params }: any) => {
  const { article } = await params
  const [data, dataLink] = await Promise.all([getArticle(article), getLinkToReserve()])

  if (!data) {
    return notFound()
  }

  return (
    <main>
      <WebPageSchema
        slug={article}
        name={data.title}
        description={data.metaData?.description || ''}
        image={getStrapiImageUrl(data.metaData?.image?.url)}
        dateModified={data.updatedAt}
        url={`https://barbitch.cz/${article}`}
      />
      <article>
        <Top title={data.title} small noMargin linkToReserve={dataLink.linkToReserve} />
        <Breadcrumbs
          items={[
            { name: 'Hlavní strana', url: 'https://barbitch.cz' },
            { name: data.title, url: `https://barbitch.cz/${article}` },
          ]}
        />
        <DynamicContent data={data.dynamicContent} />
      </article>
    </main>
  )
}

export default Article
