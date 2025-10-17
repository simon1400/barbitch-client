'use client'

import { useAppContext } from 'context/AppContext'
import React from 'react'

import OptimizedWorks from './components/OptimizedWorks'

const Admin = () => {
  const { select } = useAppContext()
  if (select === 'works') {
    return <OptimizedWorks />
  }
  return null
}

export default Admin
