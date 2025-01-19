import type { IDataHomepageService } from 'fetch/service'

import { getServiceHomepage } from 'fetch/service'

import { fetchIg } from 'fetch/instagram'
import { Axios } from 'lib/api'

import { About } from '../../sections/About'
import { HandSec } from '../../sections/HandSec'
import { Instagram } from '../../sections/Instagram'
// import Team from '../sections/Team'
import { Top } from '../../sections/Top'
import { getHomeMeta } from 'fetch/getHomepageMeta'
import { Metadata } from 'next'

interface IDataHomepage {
  title: string
  aboutUs: string
}

export async function generateMetadata(): Promise<Metadata> {
 
  const homepageMeta = await getHomeMeta()
 
  return {
    title: homepageMeta.metaData.title,
    description: homepageMeta.metaData.description,
    openGraph: homepageMeta.metaData.image ? ({
      images: [homepageMeta.metaData.image.url],
    }) : null,
  }
}

const Home = async () => {
  const dataIg = await fetchIg()
  const data: IDataHomepage = await Axios.get('/api/homepage')
  const dataService: IDataHomepageService[] = await getServiceHomepage()
  return (
    <main>
      <Top title={data.title} />
      <HandSec service={dataService} />
      {/* <Team /> */}
      <Instagram data={dataIg} />
      <About text={data.aboutUs} />
    </main>
  )
}

export default Home
