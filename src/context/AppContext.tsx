'use client'

import type { ReactNode } from 'react'

import { createContext, useCallback, useContext, useMemo, useState } from 'react'

interface AppContextType {
  menu: boolean
  setMenu: (value: boolean) => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [menu, setMenu] = useState<boolean>(false)

  const stableSetMenu = useCallback((value: boolean) => {
    setMenu(value)
  }, [])

  const contextValue = useMemo(
    () => ({
      menu,
      setMenu: stableSetMenu,
    }),
    [menu, stableSetMenu],
  )

  return <AppContext value={contextValue}>{children}</AppContext>
}

export const useAppContext = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider')
  }
  return context
}
