import parse from 'html-react-parser'

import Button from '../components/Button'
import { MasonryGalery } from '../components/MansoryGalery'
import { Top } from '../sections/Top'

// interface IDataHomepage {
//   title: string
//   aboutUs: string
// }

const Service = async () => {
  return (
    <main>
      <Top title={'Manikura'} small />
      <section className={'pt-10 pb-16'}>
        <div className={'container mx-auto w-full max-w-[1400px] px-4'}>
          <div className={'w-full mb-5 lg:mb-0'}>
            <div className={'text-xs1 lg:text-base'}>
              {parse(
                '<p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Integer tempor. Sed vel lectus. Donec odio tempus molestie, porttitor ut, iaculis quis, sem. Praesent id justo in neque elementum ultrices. Vivamus porttitor turpis ac leo. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. In rutrum. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos hymenaeos. Integer in sapien. Phasellus rhoncus. Phasellus enim erat, vestibulum vel, aliquam a, posuere eu, velit.</p>',
              )}
            </div>
          </div>
        </div>
      </section>
      <MasonryGalery />
      <section className={'pt-10 pb-16'}>
        <div className={'container mx-auto w-full max-w-[1400px] px-4'}>
          <div className={'w-full mb-5 lg:mb-0'}>
            <div className={'text-xs1 lg:text-base'}>
              {parse(
                '<p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Integer tempor. Sed vel lectus. Donec odio tempus molestie, porttitor ut, iaculis quis, sem. Praesent id justo in neque elementum ultrices. Vivamus porttitor turpis ac leo. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. In rutrum. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos hymenaeos. Integer in sapien. Phasellus rhoncus. Phasellus enim erat, vestibulum vel, aliquam a, posuere eu, velit.</p>',
              )}
            </div>
          </div>
          <Button
            className={'mt-5'}
            text={'Rezervovat termin'}
            href={'https://noona.app/cs/barbitch'}
          />
        </div>
      </section>
    </main>
  )
}

export default Service
