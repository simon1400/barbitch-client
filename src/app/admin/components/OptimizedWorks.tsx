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

const OptimizedWorks = () => {
  const [month, setMonth] = useState<number>(new Date().getMonth())
  const [data, setData] = useState<IDataWorks>()
  const [salary, setSalary] = useState<number>(0)
  const [extraProfit, setExtraProfit] = useState<number>(0)
  const [payrolls, setPayrolls] = useState<number>(0)
  const [penalty, setPenalty] = useState<number>(0)
  const [result, setResult] = useState<number>(0)
  const [tipSum, setTipSum] = useState<number>(0)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const { adminName } = useAppContext()

  const loadData = useCallback(async () => {
    setIsLoading(true)
    try {
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
    } finally {
      setIsLoading(false)
    }
  }, [adminName, month])

  useEffect(() => {
    if (adminName) {
      loadData()
    }
  }, [month, loadData, adminName])

  if (isLoading) {
    return (
      <section className={'pb-16 min-h-screen flex items-center justify-center'}>
        <div className={'text-center'}>
          <div
            className={
              'inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4'
            }
          />
          <p className={'text-gray-600'}>{'Загрузка данных...'}</p>
        </div>
      </section>
    )
  }

  return (
    <section className={'pb-16'}>
      <Container size={'md'}>
        {/* Stats Grid */}
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

        {/* Table Section */}
        <div className={'mb-6'}>
          <div className={'flex justify-between flex-col md:flex-row items-center mb-5'}>
            <h2 className={'text-md font-semibold text-gray-700 mb-5 md:mb-0'}>
              {'История работ\r'}
            </h2>
            <Select month={month} setMonth={setMonth} />
          </div>

          <div
            className={
              'relative flex flex-col w-full overflow-hidden bg-white shadow-md rounded-xl'
            }
          >
            {data?.offersDone && data.offersDone.length > 0 ? (
              <div className={'relative w-full overflow-x-auto'}>
                <table className={'w-full text-left table-auto min-w-max'}>
                  <thead>
                    <tr className={'bg-gray-50'}>
                      <Cell title={'#'} asHeader className={'hidden md:table-cell'} />
                      <Cell title={'Дата'} asHeader />
                      <Cell title={'Имя клиента'} asHeader />
                      <Cell title={'Деньги'} asHeader />
                      <Cell title={'Чай'} asHeader />
                    </tr>
                  </thead>
                  <tbody>
                    {data.offersDone.map((item, idx) => (
                      <tr key={item.id} className={'hover:bg-gray-50 transition-colors'}>
                        <Cell title={`${idx + 1}.`} className={'hidden md:table-cell'} />
                        <Cell title={formatDate(item.date)} />
                        <Cell title={item.clientName} />
                        <Cell
                          title={`${item.staffSalaries} Kč`}
                          className={'font-semibold text-green-600'}
                        />
                        <Cell
                          title={item.tip?.length ? `${item.tip} Kč` : '—'}
                          className={item.tip?.length ? 'text-primary' : 'text-gray-400'}
                        />
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className={'p-12 text-center'}>
                <svg
                  className={'w-16 h-16 mx-auto text-gray-300 mb-4'}
                  fill={'none'}
                  stroke={'currentColor'}
                  viewBox={'0 0 24 24'}
                >
                  <path
                    strokeLinecap={'round'}
                    strokeLinejoin={'round'}
                    strokeWidth={2}
                    d={
                      'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
                    }
                  />
                </svg>
                <p className={'text-gray-500'}>{'Нет данных за выбранный месяц'}</p>
              </div>
            )}
          </div>

          {/* Summary Footer */}
          {data?.offersDone && data.offersDone.length > 0 && (
            <div
              className={
                'mt-4 p-4 rounded-lg flex flex-col md:flex-row justify-between items-center'
              }
            >
              <span className={'flex items-center gap-3 text-sm md:text-base text-gray-600 mb-2'}>
                <span>{'Всего работ: '}</span>
                <span className={'text-md'}>{data.offersDone.length}</span>
              </span>
              <span className={'text-md font-bold text-primary'}>
                {result.toLocaleString()} {'Kč\r'}
              </span>
            </div>
          )}
        </div>
      </Container>
    </section>
  )
}

export default OptimizedWorks
