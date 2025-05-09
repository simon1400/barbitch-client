'use client'
import type { IDataWorks } from 'app/[locale]/admin/fetch/works'

import { useAppContext } from 'app/context/AppContext'
import { Container } from 'components/Container'
import { getWorks } from 'app/[locale]/admin/fetch/works'
import { formatDate } from 'helpers/parseDate'
import React, { useCallback, useEffect, useState } from 'react'

import { Cell } from './Cell'
import { Select } from './Select'

const Works = () => {
  const [month, setMonth] = useState<number>(new Date().getMonth())
  const [data, setData] = useState<IDataWorks>()
  const { adminName } = useAppContext()

  const loadData = useCallback(async () => {
    const offers = await getWorks(adminName, month)
    setData(offers)
  }, [adminName, month])

  useEffect(() => {
    loadData()
  }, [month, loadData])

  return (
    <section className={'pb-16'}>
      <Container size={'md'}>
        <div className={'flex justify-between flex-col md:flex-row items-center mb-5'}>
          <h2 className={'text-md1 mb-5 w-full text-center md:mb-0 md:text-left'}>{'Работа'}</h2>
          <Select month={month} setMonth={setMonth} />
        </div>
        <div
          className={
            'relative flex flex-col w-full h-full overflow-hidden text-gray-700 bg-white shadow-md rounded-xl'
          }
        >
          {data?.offersDone && (
            <div
              className={
                'relative flex flex-col w-full h-full overflow-x-scroll md:overflow-hidden text-gray-700 bg-white shadow-md rounded-xl'
              }
            >
              <table className={'w-full text-left table-auto min-w-max'}>
                <thead>
                  <tr>
                    <Cell title={'#'} asHeader />
                    <Cell title={'Дата'} asHeader />
                    <Cell title={'Имя клиента'} asHeader />
                    <Cell title={'Заработанные деньги'} asHeader />
                    <Cell title={'Чаевые'} asHeader />
                  </tr>
                </thead>
                {data && (
                  <tbody>
                    {data.offersDone.map((item, idx) => (
                      <tr key={item.id}>
                        <Cell title={`${idx + 1}.`} />
                        <Cell title={formatDate(item.date)} />
                        <Cell title={item.clientName} />
                        <Cell title={`${item.staffSalaries} Kč`} />
                        <Cell title={item.tip?.length ? `${item.tip} Kč` : ''} />
                      </tr>
                    ))}
                  </tbody>
                )}
              </table>
            </div>
          )}
        </div>
      </Container>
    </section>
  )
}

export default Works
