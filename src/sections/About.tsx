'use client'
// import Button from 'components/Button'
import parse from 'html-react-parser'
import { BigLogoIcon } from 'icons/BigLogo'

const About = ({ text }: { text: string }) => {
  return (
    <section className={'pt-18 lg:pt-33 pb-23 lg:pb-20'}>
      <div className={'container mx-auto w-full max-w-[1400px] px-4'}>
        <div className={'mb-4.5 lg:mb-11.5'}>
          <BigLogoIcon className={'w-full'} />
        </div>

        <div className={'lg:flex items-center gap-23'}>
          <div className={'w-full mb-5 lg:mb-0'}>
            <div className={'text-xs1 lg:text-base'}>{parse(text)}</div>
          </div>
          {/* <div className={'text-center lg:text-left'}>
            <Button text={'vice o nas'} href={'/o-nas'} />
          </div> */}
        </div>
      </div>
    </section>
  )
}

export default About
