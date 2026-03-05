import Button from 'components/Button'
import { Container } from 'components/Container'
import { BigLogoIcon } from 'icons/BigLogo'
import { parseHtml } from 'lib/parseHtml'

const About = ({ text }: { text: string }) => {
  return (
    <section className={'pt-18 lg:pt-33 pb-23 lg:pb-20'}>
      <Container size={'xl'}>
        <div className={'mb-4.5 lg:mb-11.5'}>
          <BigLogoIcon className={'w-full'} />
        </div>

        <div className={'items-center gap-23'}>
          <div className={'w-full mb-5 content'}>
            <div className={'content'}>{parseHtml(text)}</div>
          </div>
          <div className={'text-center lg:text-left'}>
            <Button text={'Poznejte náš salon'} href={'/o-nas'} id={'about-us-btn'} />
          </div>
        </div>
      </Container>
    </section>
  )
}

export default About
