/* eslint-disable sonarjs/no-globals-shadowing */
'use client'

import Button from 'components/Button'

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <section
      className={'min-h-[600px] md:min-h-[700px] h-screen flex'}
      style={{
        backgroundImage: 'linear-gradient(0deg, rgba(231,30,110,1) 0%, rgba(255,0,101,0.5) 100%)',
      }}
    >
      <div className={'m-auto text-center'}>
        <div className={'mb-[50px] md:mb-[150px]'}>
          <h1 className={'text-big md:text-[250px] font-bold leading-none'}>{'Chyba!'}</h1>
          <p className={'text-white font-bold text-md md:text-[50px] md:-mt-[150px]'}>
            {error.message}
          </p>
        </div>
        <Button
          text={'Zkusit znovu'}
          href={'/'}
          onClick={(e) => {
            e.preventDefault()
            reset()
          }}
        />
      </div>
    </section>
  )
}
