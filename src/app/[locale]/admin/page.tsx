'use client'
import type { IDataWorks } from 'fetch/works'

import { Container } from 'components/Container'
import { getWorks } from 'fetch/works'
import { useOnMountUnsafe } from 'helpers/useOnMountUnsaf'
import React, { useCallback, useEffect, useState } from 'react'

import { Top } from '../../../sections/Top/Top'

import { Table } from './components/Table'
import { logins, monthLabels } from './data'

const Result = () => {
  const [month, setMonth] = useState<number>(new Date().getMonth())
  const [data, setData] = useState<IDataWorks>()
  const [cache, setCache] = useState<Record<string, IDataWorks>>({})

  const getAuthUser = () => {
    const storedUsername = localStorage.getItem('usernameLocalData')
    const storedPassword = localStorage.getItem('passwordLocalData')

    if (storedUsername && storedPassword && logins[storedUsername] === storedPassword) {
      getWorks(storedUsername, month).then((offers) => {
        setData(offers)
        setCache((prevCache) => ({
          ...prevCache,
          [`${storedUsername}-${month}`]: offers,
        }))
      })
    }
  }

  const loadData = useCallback(async () => {
    const offers = await getWorks(username, month)
    setData(offers)
  }, [username, month, cache])

  useOnMountUnsafe(() => {})

  useEffect(() => {
    if (auth) loadData()
  }, [auth, month, loadData])

  return (
    <main>
      <Top title={'Prace'} small linkToReserve={'/'} />
      <section className={'pt-20 pb-16'}>
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
      </section>
    </main>
  )
}

export default Result
