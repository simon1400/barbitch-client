'use client'
import type { IDataWorks } from 'fetch/works'

import { Container } from 'components/Container'
import { getWorks } from 'fetch/works'
import { useOnMountUnsafe } from 'helpers/useOnMountUnsaf'
import { redirect } from 'next/navigation'
import React, { useCallback, useEffect, useState } from 'react'

import { Select } from './components/Select'
import { Table } from './components/Table'
import { logins } from './data'

const Result = () => {
  const [month, setMonth] = useState<number>(new Date().getMonth())
  const [data, setData] = useState<IDataWorks>()
  const [username, setUsername] = useState<string>('')

  const getAuthUser = () => {
    const storedUsername = localStorage.getItem('usernameLocalData')
    const storedPassword = localStorage.getItem('passwordLocalData')

    if (storedUsername && storedPassword && logins[storedUsername] === storedPassword) {
      getWorks(storedUsername, month).then((offers) => {
        setData(offers)
      })
      setUsername(storedUsername)
    } else {
      redirect('/login')
    }
  }

  const loadData = useCallback(async () => {
    const offers = await getWorks(username, month)
    setData(offers)
  }, [username, month])

  useOnMountUnsafe(() => {
    getAuthUser()
  })

  useEffect(() => {
    loadData()
  }, [month, loadData])

  return (
    <section className={'pb-16'}>
      <Container size={'md'}>
        <div className={'flex justify-between flex-col md:flex-row items-center mb-5'}>
          <h2 className={'text-md1 mb-5 w-full text-center md:mb-0 md:text-left'}>{data?.name}</h2>
          <Select month={month} setMonth={setMonth} />
        </div>
        <div
          className={
            'relative flex flex-col w-full h-full overflow-hidden text-gray-700 bg-white shadow-md rounded-xl'
          }
        >
          {data?.offersDone && <Table data={data.offersDone} />}
        </div>
      </Container>
    </section>
  )
}

export default Result
