/* eslint-disable react/no-unstable-context-value */
'use client'

import type { ReactNode } from 'react'

import { createContext, useContext, useState } from 'react'

interface AppContextType {
  menu: boolean
  setMenu: (value: boolean) => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [menu, setMenu] = useState<boolean>(false)

  const adminValues = {
    menu,
    setMenu,
  }

  return <AppContext value={adminValues}>{children}</AppContext>
}

export const useAppContext = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider')
  }
  return context
}
