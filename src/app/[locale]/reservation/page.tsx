'use client'

import React from 'react'

import { Top } from '../../../sections/Top/Top'

const Reservation = () => {
  return (
    <main>
      <Top title={'Rezervace'} small />
      <section>
        <iframe
          src={
            'https://noona.app/cs//barbitch/book?iframe=true&darkModeDisabled=true&showCancelButton=true'
          }
          frameBorder={'0'}
          width={'100%'}
          height={'1000px'}
          style={{ height: '80vh', backgroundColor: 'transparent' }}
        />
      </section>
    </main>
  )
}

export default Reservation
