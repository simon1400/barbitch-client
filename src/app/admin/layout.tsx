'use client'

import type { UserRole } from './data'

import { Container } from 'components/Container'
import { useAppContext } from 'context/AppContext'
import { useOnMountUnsafe } from 'helpers/useOnMountUnsaf'
import { redirect } from 'next/navigation'
import { Top } from 'sections/Top/Top'

// import { Sidebar } from './components/Sidebar'

import './styles.scss'

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const { adminName, setAdminName } = useAppContext()

  const { setUserRole } = useAppContext()

  const getAuthUser = () => {
    const storedUsername = localStorage.getItem('usernameLocalData')
    const storedRole = localStorage.getItem('userRole') as UserRole | null

    if (!storedUsername || !storedRole) {
      setAdminName('')
      setUserRole(null)
      redirect('/login')
    }

    setAdminName(storedUsername)
    setUserRole(storedRole)
  }

  useOnMountUnsafe(() => {
    getAuthUser()
  })

  return (
    <div id={'layout-admin-page'}>
      <Top title={adminName} small linkToReserve={''} admin />
      <Container size={'xl'}>
        <div className={'md:flex'}>
          {/* <Sidebar /> */}
          <main className={'w-full'}>{children}</main>
        </div>
      </Container>
    </div>
  )
}
