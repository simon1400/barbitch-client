import Contact from '../sections/Contact'

import { OfficialInfo } from './OficialInfo'

const Footer = async () => {
  return (
    <footer className={'pt-27 lg:pt-30'}>
      <Contact />
      <OfficialInfo />
    </footer>
  )
}

export default Footer
