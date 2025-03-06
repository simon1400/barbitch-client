import Button from 'components/Button'

export default function NotFound() {
  return (
    <section
      className={'min-h-[600px] md:min-h-[700px] h-screen flex'}
      style={{
        backgroundImage: 'linear-gradient(0deg, rgba(231,30,110,1) 0%, rgba(255,0,101,0.5) 100%)',
      }}
    >
      <div className={'m-auto text-center'}>
        <div className={'mb-[50px] md:mb-[100px]'}>
          <h1 className={'text-top md:text-[450px] font-bold leading-none'}>{'404'}</h1>
          <p className={'text-white font-bold text-lg md:text-[107px] md:-mt-[200px]'}>
            {'NAILS NOT FOUND'}
          </p>
        </div>
        <div>
          <Button text={'zpět na úvod'} href={'/'} />
        </div>
      </div>
    </section>
  )
}
