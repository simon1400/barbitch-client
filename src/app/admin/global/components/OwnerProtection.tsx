'use client'

import { useAppContext } from 'context/AppContext'
import { redirect } from 'next/navigation'
import { useEffect, useState } from 'react'

interface OwnerProtectionProps {
  children: React.ReactNode
}

export const OwnerProtection = ({ children }: OwnerProtectionProps) => {
  const { userRole } = useAppContext()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    // Проверяем роль из localStorage
    const storedRole = localStorage.getItem('userRole')

    if (storedRole !== 'owner') {
      redirect('/admin')
    } else {
      setIsChecking(false)
    }
  }, [userRole])

  if (isChecking) {
    return (
      <div className={'fixed inset-0 flex items-center justify-center bg-white'}>
        <div className={'text-center'}>
          <div
            className={'inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary'}
          />
          <p className={'mt-4 text-gray-600'}>Проверка доступа...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
