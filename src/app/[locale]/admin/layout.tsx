'use client'

import { useAppContext } from 'app/context/AppContext'
import { Container } from 'components/Container'
import { useOnMountUnsafe } from 'helpers/useOnMountUnsaf'
import { redirect } from 'next/navigation'
import { Top } from 'sections/Top/Top'

// import { Sidebar } from './components/Sidebar'
import { logins } from './data'

import './styles.scss'

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const { adminName, setAdminName } = useAppContext()

  const getAuthUser = () => {
    const storedUsername = localStorage.getItem('usernameLocalData')
    const storedPassword = localStorage.getItem('passwordLocalData')

    if (storedUsername && storedPassword && logins[storedUsername] === storedPassword) {
      setAdminName(storedUsername)
    } else {
      setAdminName('')
      redirect('/login')
    }
  }

  useOnMountUnsafe(() => {
    getAuthUser()
  })

  return (
    <div id={'layout-admin-page'}>
      <Top title={adminName} small linkToReserve={''} />
      <Container size={'xl'}>
        <div className={'md:flex'}>
          {/* <Sidebar /> */}
          <main className={'w-full'}>{children}</main>
        </div>
      </Container>
    </div>
  )
}
