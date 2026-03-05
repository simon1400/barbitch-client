import type { Metadata } from 'next'

import { DynamicContent } from 'components/DynamicContent'
import { getArticle } from 'fetch/article'
import { getLinkToReserve } from 'fetch/contact'
import { Axios } from 'lib/api'
import { getStrapiImageUrl } from 'lib/image-utils'
import { notFound } from 'next/navigation'
import { ArticleSchema } from 'schemasOrg/article'
import { BreadcrumbSchema } from 'schemasOrg/breadcrumb'
import { Top } from 'sections/Top/Top'

export async function generateStaticParams() {
  try {
    const articles = (await Axios.get('/api/articles?fields[0]=slug')) as { slug: string }[]
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
    return {
      title: 'Stránka nenalezena',
      description: '',
    }
  }

  const { title, metaData } = data

  return {
    title: metaData?.title || title,
    description: metaData?.description,
    openGraph: {
      title: metaData?.title || title,
      description: metaData?.description || '',
      siteName: 'Barbitch',
      images: [getStrapiImageUrl(metaData?.image?.url)],
      url: `https://barbitch.cz/${article}`,
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: metaData?.title || title,
      description: metaData?.description || '',
      images: [getStrapiImageUrl(metaData?.image?.url)],
    },
    keywords: ['barbitch', 'bar.bitch', 'bar bitch', 'Brno', 'Nehty', title],
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
      <BreadcrumbSchema
        items={[
          { name: 'Hlavní strana', url: 'https://barbitch.cz' },
          { name: data.title, url: `https://barbitch.cz/${article}` },
        ]}
      />
      <ArticleSchema
        title={data.title}
        description={data.metaData?.description || data.title}
        image={getStrapiImageUrl(data.metaData?.image?.url)}
        datePublished={data.publishedAt || new Date().toISOString()}
        dateModified={data.updatedAt || new Date().toISOString()}
        url={`https://barbitch.cz/${article}`}
      />
      <article>
        <Top title={data.title} small linkToReserve={dataLink.linkToReserve} />
        <DynamicContent data={data.dynamicContent} />
      </article>
    </main>
  )
}

export default Article
