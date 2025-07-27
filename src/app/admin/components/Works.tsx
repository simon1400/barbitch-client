'use client'

import type { IDataWorks } from '../fetch/works'

import { Container } from 'components/Container'
import { useAppContext } from 'context/AppContext'
import { formatDate } from 'helpers/parseDate'
import React, { useCallback, useEffect, useState } from 'react'

import { blockStatsItems } from '../data'
import { getWorks } from '../fetch/works'

import { BlocksContent } from './BlocksContent'
import { Cell } from './Cell'
import { Select } from './Select'

const Works = () => {
  const [month, setMonth] = useState<number>(new Date().getMonth())
  const [data, setData] = useState<IDataWorks>()
  const [salary, setSalary] = useState<number>(0)
  const [extraProfit, setExtraProfit] = useState<number>(0)
  const [payrolls, setPayrolls] = useState<number>(0)
  const [penalty, setPenalty] = useState<number>(0)
  const [result, setResult] = useState<number>(0)
  const [tipSum, setTipSum] = useState<number>(0)

  const { adminName } = useAppContext()

  const loadData = useCallback(async () => {
    const { works, salary, extraProfit, payrolls, penalty, result, tipSum } = await getWorks(
      adminName,
      month,
    )
    setData(works)
    setSalary(salary)
    setExtraProfit(extraProfit)
    setPayrolls(payrolls)
    setPenalty(penalty)
    setResult(result)
    setTipSum(tipSum)
  }, [adminName, month])

  useEffect(() => {
    loadData()
  }, [month, loadData])

  return (
    <section className={'pb-16'}>
      <Container size={'md'}>
        <BlocksContent
          items={blockStatsItems(
            salary,
            data?.offersDone.length || 0,
            extraProfit,
            payrolls,
            penalty,
            result,
            tipSum,
          )}
        />
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
                    <Cell title={'#'} asHeader className={'hidden md:table-cell'} />
                    <Cell title={'Дата'} asHeader />
                    <Cell title={'Имя клиента'} asHeader />
                    <Cell title={'Деньги'} asHeader />
                    <Cell title={'Чай'} asHeader />
                  </tr>
                </thead>
                {data && (
                  <tbody>
                    {data.offersDone.map((item, idx) => (
                      <tr key={item.id}>
                        <Cell title={`${idx + 1}.`} className={'hidden md:table-cell'} />
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
