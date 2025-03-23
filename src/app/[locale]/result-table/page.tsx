'use client'
import type { IDataWorks } from 'fetch/works'

import { Container } from 'components/Container'
import { getWorks } from 'fetch/works'
import { useOnMountUnsafe } from 'helpers/useOnMountUnsaf'
import React, { useCallback, useEffect, useState } from 'react'

import { Top } from '../../../sections/Top/Top'

import { Auth } from './Auth'
import { logins, monthLabels } from './data'
import { Table } from './Table'

const Result = () => {
  const [username, setUsername] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [month, setMonth] = useState<number>(new Date().getMonth())
  const [auth, setAuth] = useState(false)
  const [data, setData] = useState<IDataWorks>()
  const [cache, setCache] = useState<Record<string, IDataWorks>>({})

  // Загрузка данных с кэшированием
  const loadData = useCallback(async () => {
    const cacheKey = `${username}-${month}`

    if (cache[cacheKey]) {
      setData(cache[cacheKey])
      return
    }

    const offers = await getWorks(username, month)
    setData(offers)
    setCache((prevCache) => ({ ...prevCache, [cacheKey]: offers }))
  }, [username, month, cache])

  // Предзагрузка данных при монтировании
  useOnMountUnsafe(() => {
    const storedUsername = localStorage.getItem('usernameLocalData')
    const storedPassword = localStorage.getItem('passwordLocalData')

    if (storedUsername && storedPassword && logins[storedUsername] === storedPassword) {
      setUsername(storedUsername)
      setPassword(storedPassword)
      setAuth(true)

      getWorks(storedUsername, month).then((offers) => {
        setData(offers)
        setCache((prevCache) => ({
          ...prevCache,
          [`${storedUsername}-${month}`]: offers,
        }))
      })
    }
  })

  useEffect(() => {
    if (auth) loadData()
  }, [auth, month, loadData])

  const login = useCallback(() => {
    if (logins[username] === password) {
      setAuth(true)
      localStorage.setItem('usernameLocalData', username)
      localStorage.setItem('passwordLocalData', password)
      loadData()
    }
  }, [username, password, loadData])

  return (
    <main>
      <Top title={'Prace'} small linkToReserve={'/'} />
      <section className={'pt-20 pb-16'}>
        {!auth ? (
          <Auth
            login={login}
            username={username}
            password={password}
            setPassword={setPassword}
            setUsername={setUsername}
          />
        ) : (
          <Container size={'md'}>
            <div className={'flex justify-between flex-col md:flex-row items-center mb-5'}>
              <h2 className={'text-md1 mb-5 w-full text-center md:mb-0 md:text-left'}>
                {data?.name}
              </h2>
              <select
                id={'month-select'}
                value={month}
                onChange={(e) => setMonth(Number(e.target.value))}
                className={
                  'bg-white border border-accent text-sm focus:ring-blue-500 focus:border-blue-500 block w-[200px] p-2.5'
                }
              >
                {monthLabels.map((label, idx) => (
                  <option value={idx} key={label}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
            <div
              className={
                'relative flex flex-col w-full h-full overflow-scroll text-gray-700 bg-white shadow-md rounded-xl'
              }
            >
              {data?.offersDone && <Table data={data.offersDone} />}
            </div>
          </Container>
        )}
      </section>
    </main>
  )
}

export default Result
