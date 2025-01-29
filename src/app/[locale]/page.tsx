import type { Metadata } from 'next'

import { getHomeMeta } from 'fetch/getMeta'
import { getHomepage } from 'fetch/homepage'
import { fetchIg } from 'fetch/instagram'
import { getServiceHomepage } from 'fetch/service'
import { SchemaJsonHomepage } from 'schemasOrg/homepage'

import { About } from '../../sections/About'
import { HandSec } from '../../sections/HandSec'
import { Instagram } from '../../sections/Instagram'
import { Top } from '../../sections/Top'

export async function generateMetadata(): Promise<Metadata> {
  const homepageMeta = await getHomeMeta()

  return {
    title:
      homepageMeta.metaData.title ||
      'Bar.bitch – Luxusní manikúra, obočí a řasy | Trendy beauty studio Brno',
    description:
      homepageMeta.metaData.description ||
      'Objevte moderní beauty studio Bar.bitch v Brně. Profesionální manikúra, trendy obočí a dokonalé řasy. Individuální přístup a relaxace s kvalitními materiály. Rezervujte si termín ještě dnes!',
    openGraph: homepageMeta.metaData.image
      ? {
          title: homepageMeta.metaData.title,
          description: homepageMeta.metaData.description,
          images: [homepageMeta.metaData.image.url],
          url: 'https://barbitch.cz',
          type: 'website',
        }
      : null,
    twitter: {
      card: 'summary_large_image',
      title: homepageMeta.metaData.title,
      description: homepageMeta.metaData.description,
      images: homepageMeta.metaData.image ? [homepageMeta.metaData.image.url] : undefined,
    },
  }
}

const Home = async () => {
  try {
    const [dataIg, dataService, data] = await Promise.all([
      fetchIg(),
      getServiceHomepage(),
      getHomepage(),
    ])

    return (
      <main>
        <SchemaJsonHomepage />
        <Top title={data.title} />
        <HandSec service={dataService} />
        <Instagram data={dataIg} />
        <About text={data.aboutUs} />
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
