import { Container } from './Container'

export const OfficialInfo = () => {
  return (
    <section className={'bg-accent text-white '}>
      <Container size={'xl'}>
        <div
          className={
            'flex flex-col md:flex-row items-center justify-between py-4 text-center gap-2'
          }
        >
          {/* Právní odkazy patří do <nav> — v patičce byly volně v <div>. */}
          <nav aria-label={'Právní informace'}>
            <a className={'hover:text-primary'} href={'/zasady-ochrany-osobnich-udaju'}>
              {'Zásady ochrany osobních údajů'}
            </a>
          </nav>
          <div>
            <p className={'flex flex-col md:flex-row'}>
              <span>{'Provozovatel: Dmytro Pechunka, '}</span>
              <span>{'IČO: 17407613'}</span>
            </p>
          </div>
          <nav
            className={'flex gap-1 md:gap-5 flex-col md:flex-row'}
            aria-label={'Obchodní podmínky a cookies'}
          >
            <a className={'hover:text-primary'} href={'/obchodni-podminky'}>
              {'Obchodní podmínky'}
            </a>
            <a className={'hover:text-primary'} href={'/cookies-policy'}>
              {'Zásady používání cookies'}
            </a>
          </nav>
        </div>
      </Container>
    </section>
  )
}
