import { withHiddenRoutes } from 'helpers/withHiddenRoutes'
// import dynamic from 'next/dynamic'

import Contact from '../sections/Contact'
// const CustomMap = dynamic(() => import('../sections/Map'))

const Footer = async () => {
  return (
    <footer className={'pt-27 lg:pt-30'}>
      <Contact />
      {/* <CustomMap /> */}
    </footer>
  )
}

export default withHiddenRoutes(Footer, ['/book'])
