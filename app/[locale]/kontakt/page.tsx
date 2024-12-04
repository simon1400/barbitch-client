// import type { IDataService } from 'fetch/service'

// import { getService } from 'fetch/service'

// import { fetchIg } from '../../fetch/instagram'
// import { Axios } from '../../lib/api'
// import { Hand } from '../components/Hand'
import { Top } from '../sections/Top'

interface IDataHomepage {
  title: string
  aboutUs: string
}

const Contact = async () => {
  // const dataIg = await fetchIg()
  // const data: IDataHomepage = await Axios.get('/api/homepage')
  // const dataService: IDataService[] = await getService()
  return (
    <main>
      <Top title={'Kontakt'} small />
    </main>
  )
}

export default Contact
