'use client'

import type { ReactNode } from 'react'

import { createContext, useContext, useState } from 'react'

interface AppContextType {
  adminName: string
  setAdminName: (value: string) => void
  select: string
  setSelect: (value: string) => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [adminName, setAdminName] = useState<string>('')
  const [select, setSelect] = useState<string>('works')

  const adminValues = {
    adminName,
    setAdminName,
    select,
    setSelect,
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
