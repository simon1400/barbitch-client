'use client'

import { redirect } from 'next/navigation'
import { useCallback, useState } from 'react'
import { Top } from 'sections/Top/Top'

import { logins } from '../admin/data'

const Login = () => {
  const [username, setUsername] = useState<string>('')
  const [password, setPassword] = useState<string>('')

  const login = useCallback(() => {
    if (logins[username] === password) {
      localStorage.setItem('usernameLocalData', username)
      localStorage.setItem('passwordLocalData', password)
      redirect('/admin')
    }
  }, [username, password])

  return (
    <>
      <Top title={'Login'} small linkToReserve={'/'} />
      <div className={'border border-primary bg-white max-w-[350px] p-10 mx-auto'}>
        <h2 className={'text-md1 mb-5'}>{'Login'}</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            login()
          }}
        >
          <input
            className={'form-input'}
            value={username}
            placeholder={'Username'}
            onChange={(e) => setUsername(e.target.value)}
            type={'text'}
          />
          <input
            className={'form-input'}
            value={password}
            placeholder={'Password'}
            onChange={(e) => setPassword(e.target.value)}
            type={'password'}
          />
          <button type={'submit'} className={'button-primary'}>
            {'Login'}
          </button>
        </form>
      </div>
    </>
  )
}

export default Login
