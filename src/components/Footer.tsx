import { withHiddenRoutes } from 'helpers/withHiddenRoutes'

import Contact from '../sections/Contact'
import CustomMap from '../sections/Map'

const Footer = async () => {
  return (
    <footer className={'pt-27 lg:pt-30'}>
      <Contact />
      <CustomMap />
    </footer>
  )
}

export default withHiddenRoutes(Footer, ['/book'])
