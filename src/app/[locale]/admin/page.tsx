'use client'

import { useAppContext } from 'app/context/AppContext'
import React from 'react'

import Works from './components/Works'

const Admin = () => {
  const { select } = useAppContext()
  if (select === 'works') {
    return <Works />
  }
  return null
}

export default Admin
