import { withHiddenRoutes } from 'helpers/withHiddenRoutes'
// import dynamic from 'next/dynamic'

import Contact from '../sections/Contact'

import { Container } from './Container'
// const CustomMap = dynamic(() => import('../sections/Map'))

const Footer = async () => {
  return (
    <footer className={'pt-27 lg:pt-30'}>
      <Contact />
      {/* <CustomMap /> */}
      <section className={'bg-accent text-white '}>
        <Container size={'xl'}>
          <div className={'flex items-center justify-between py-4'}>
            <div>
              <a className={'hover:text-primary'} href={'/zasady-ochrany-osobnich-udaju'}>
                {'Zásady ochrany osobních údajů'}
              </a>
            </div>
            <div>
              <p>{'Provozovatel: Dmytro Pechunka, IČO: 17407613'}</p>
            </div>
            <div className={'flex gap-5'}>
              <a className={'hover:text-primary'} href={'/obchodni-podminky'}>
                {'Obchodní podmínky'}
              </a>
              <a className={'hover:text-primary'} href={'/cookies-policy'}>
                {'Cookies Policy'}
              </a>
            </div>
          </div>
        </Container>
      </section>
    </footer>
  )
}

export default withHiddenRoutes(Footer, ['/book'])
