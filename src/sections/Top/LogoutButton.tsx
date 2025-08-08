'use client'
import Button from 'components/Button'
import { useAppContext } from 'context/AppContext'
import { redirect } from 'next/navigation'

export const LogoutButton = () => {
  const { setAdminName } = useAppContext()
  const logout = (e: any) => {
    e.preventDefault()
    localStorage.removeItem('usernameLocalData')
    localStorage.removeItem('passwordLocalData')
    setAdminName('')
    redirect('/login')
  }
  return (
    <div>
      <Button text={'Odhlasit se'} id={'book-button'} href={'/'} onClick={(e) => logout(e)} />
    </div>
  )
}
