import type { IDataService } from 'fetch/service'

import { getService } from 'fetch/service'

import { fetchIg } from '../../fetch/instagram'
import { Axios } from '../../lib/api'

import { About } from './sections/About'
import { HandSec } from './sections/HandSec'
import { Instagram } from './sections/Instagram'
import { Top } from './sections/Top'

interface IDataHomepage {
  title: string
  aboutUs: string
}

const Home = async () => {
  const dataIg = await fetchIg()
  const data: IDataHomepage = await Axios.get('/api/homepage')
  const dataService: IDataService[] = await getService()
  return (
    <main>
      <Top title={data.title} />
      <HandSec service={dataService} />
      <Instagram data={dataIg} />
      <About text={data.aboutUs} />
    </main>
  )
}

export default Home
