/* eslint-disable react/no-unstable-context-value */
'use client'

import type { ReactNode } from 'react'

import { createContext, useContext, useState } from 'react'

interface AppContextType {
  adminName: string
  setAdminName: (value: string) => void
  select: string
  setSelect: (value: string) => void
  menu: boolean
  setMenu: (value: boolean) => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [adminName, setAdminName] = useState<string>('')
  const [menu, setMenu] = useState<boolean>(false)
  const [select, setSelect] = useState<string>('works')

  const adminValues = {
    adminName,
    setAdminName,
    select,
    setSelect,
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
