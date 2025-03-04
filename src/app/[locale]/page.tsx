import type { Metadata } from 'next'

import { getRandomPost } from 'fetch/blog'
import { getHomeMeta } from 'fetch/getMeta'
import { getHomepage } from 'fetch/homepage'
import { getServiceHomepage } from 'fetch/service'
import { SchemaJsonHomepage } from 'schemasOrg/homepage'
import About from 'sections/About'
import Galery from 'sections/Galery'
import HandSec from 'sections/HandSec'
import Posts from 'sections/Posts'
import Reviews from 'sections/Reviews'
import { Top } from 'sections/Top/Top'

export async function generateMetadata(): Promise<Metadata> {
  const homepageMeta = await getHomeMeta()

  return {
    title: homepageMeta.metaData.title || 'Barbitch – Manikúra, řasy a obočí v Brně',
    description:
      homepageMeta.metaData.description ||
      'Objevte moderní beauty studio Bar.bitch v Brně. Profesionální manikúra, trendy obočí a dokonalé řasy. Individuální přístup a relaxace s kvalitními materiály. Rezervujte si termín ještě dnes!',
    openGraph: {
      title: homepageMeta.metaData.title,
      siteName: 'Barbitch',
      locale: 'cs',
      description: homepageMeta.metaData.description,
      images: [
        homepageMeta.metaData.image
          ? homepageMeta.metaData.image.url
          : 'https://barbitch.cz/assets/bigBaner.jpg',
      ],
      url: 'https://barbitch.cz',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: homepageMeta.metaData.title,
      description: homepageMeta.metaData.description,
      images: [
        homepageMeta.metaData.image
          ? homepageMeta.metaData.image.url
          : 'https://barbitch.cz/assets/bigBaner.jpg',
      ],
    },
    keywords: [
      'barbitch',
      'bar.bitch',
      'bar bitch',
      'Brno',
      'Kosmetický salon',
      'Manikúra',
      'Prodlužování řas',
      'Úprava obočí',
    ],
    alternates: {
      canonical: 'https://barbitch.cz',
    },
  }
}

const Home = async () => {
  try {
    const [dataService, data, posts] = await Promise.all([
      getServiceHomepage(),
      getHomepage(),
      getRandomPost(),
    ])

    return (
      <main>
        <SchemaJsonHomepage />
        <Top title={data.title} />
        <HandSec service={dataService} />
        <Galery data={data.galery} />
        {!!posts.length && <Posts data={posts} />}
        <About text={data.aboutUs} />
        <Reviews />
      </main>
    )
  } catch (error) {
    console.error('Ошибка при получении данных:', error)

    return (
      <main>
        <p>{'Chyba při načítání dat. Zkuste to prosím později.'}</p>
      </main>
    )
  }
}

export default Home
