'use client'
import type { IDataWorks } from 'fetch/works'

import { formatDate } from 'helpers/parseDate'
import { useOnMountUnsafe } from 'helpers/useOnMountUnsaf'
import { getWorks } from 'fetch/works'
import { useEffect, useState } from 'react'

import { Top } from '../../../sections/Top'

const mL = [
  'Январь',
  'Февраль',
  'Март',
  'Апрель',
  'Май',
  'Июнь',
  'Июль',
  'Август',
  'Сентябрь',
  'Октябрь',
  'Ноябрь',
  'Декабрь',
]

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const logins: any = {
  'Liliia Radchenko': '5pzR773z',
  'Azaliya Baltiyeva': '34ndbQ1a',
  'Mariia Medvedeva': 'jB467eMO',
  'Svetlana Vilisova': 'J7h133Jz',
  'Anastasiia Karpenko': 'wL9eg58g',
}

const CellHead = ({ title }: { title: string }) => {
  return (
    <th className={'p-4 border-b border-blue-gray-100 bg-blue-gray-50'}>
      <p
        className={
          'block font-sans text-sm antialiased font-normal leading-none text-blue-gray-900 opacity-70'
        }
      >
        {title}
      </p>
    </th>
  )
}

const CellBody = ({ title }: { title: string }) => {
  return (
    <td className={'p-4 border-b border-blue-gray-50'}>
      <a
        href={'#'}
        className={
          'block font-sans text-sm antialiased font-medium leading-normal text-blue-gray-900'
        }
      >
        {title}
      </a>
    </td>
  )
}

const Result = () => {
  const [username, setUsername] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [month, setMonth] = useState<number | string>(new Date().getMonth())
  const [auth, setAuth] = useState(false)
  const [updateLocal, setUpdateLocal] = useState(false)

  const [data, setData] = useState<IDataWorks>()

  const getData = async () => {
    const parseMonth = +month < 9 ? `0${+month + 1}` : +month + 1
    const offers = await getWorks(username, parseMonth)
    setData(offers)
  }

  useOnMountUnsafe(async () => {
    getData()
    const usernameLocale = localStorage.getItem('usernameLocalData')
    const passwordLocale = localStorage.getItem('passwordLocalData')
    if (usernameLocale && passwordLocale) {
      setUsername(usernameLocale)
      setPassword(passwordLocale)
      setUpdateLocal(true)
    }
  })

  useEffect(() => {
    getData()
  }, [month])

  const login = () => {
    const validate: boolean = logins[username] === password
    if (validate) {
      setAuth(validate)
      getData()
      localStorage.setItem('usernameLocalData', username)
      localStorage.setItem('passwordLocalData', password)
    }
  }

  useEffect(() => {
    login()
  }, [updateLocal])

  return (
    <main>
      <Top title={'Prace'} small />
      <section className={'pt-20 pb-16'}>
        {!auth && (
          <div className={'border border-primary bg-white max-w-[350px] p-10 mx-auto'}>
            <h2 className={'text-md1 mb-5'}>{'Login'}</h2>
            <form onSubmit={() => login()}>
              <input
                className={'h-10 p-5 border border-accent w-full mb-5'}
                value={username}
                placeholder={'Username'}
                onChange={(e) => setUsername(e.target.value)}
                type={'text'}
              />
              <input
                className={'h-10 p-5 border border-accent w-full mb-5'}
                value={password}
                placeholder={'Password'}
                onChange={(e) => setPassword(e.target.value)}
                type={'password'}
              />
              <button
                type={'submit'}
                className={'bg-primary text-white font-bold uppercase py-2.5 px-5'}
              >
                {'Login'}
              </button>
            </form>
          </div>
        )}
        {auth && (
          <div className={'container mx-auto px-5 max-w-[800px]'}>
            <div className={'flex justify-between flex-col md:flex-row items-center mb-5'}>
              <h2 className={'text-md1 mb-5 text-center md:mb-0 md:text-left'}>{data?.name}</h2>
              <div>
                <select
                  id={'countries'}
                  onChange={(e) => setMonth(e.target.value)}
                  value={month}
                  // defaultValue={month}
                  className={
                    'bg-white border border-accent text-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  '
                  }
                >
                  {mL.map((item, idx) => (
                    <option value={idx} key={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div
              className={
                'relative flex flex-col w-full h-full overflow-scroll text-gray-700 bg-white shadow-md rounded-xl bg-clip-border'
              }
            >
              <table className={'w-full text-left table-auto min-w-max'}>
                <thead>
                  <tr>
                    <CellHead title={'#'} />
                    <CellHead title={'Дата'} />
                    <CellHead title={'Имя клиента'} />
                    <CellHead title={'Заработтыне деньги'} />
                    <CellHead title={'Чаевые'} />
                  </tr>
                </thead>
                <tbody>
                  {data?.offersDone.map((item, idx) => (
                    <tr key={item.id}>
                      <CellBody title={`${idx + 1}.`} />
                      <CellBody title={formatDate(item.date)} />
                      <CellBody title={item.clientName} />
                      <CellBody title={`${item.staffSalaries} Kč`} />
                      <CellBody title={item.tip?.length ? `${item.tip} Kč` : ''} />
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>
    </main>
  )
}

export default Result
