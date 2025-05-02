'use client'
import type { IFilteredAdminsData } from 'fetch/allAdminsHours'
import type { IFilteredData } from 'fetch/allWorks'
import type { ICombineData } from 'fetch/costs'

import { Container } from 'components/Container'
import { getAdminsHours } from 'fetch/allAdminsHours'
import { getAllWorks } from 'fetch/allWorks'
import { getMoney } from 'fetch/costs'
import { useCallback, useEffect, useState } from 'react'

import { Administrators } from './components/Administrators'
import { Compare } from './components/Compare'
import { Masters } from './components/Masters'
import { Summary } from './components/Summary'

const GlobalMonthStates = () => {
  const [month, setMonth] = useState<number>(new Date().getMonth())
  const [works, setWorks] = useState<IFilteredData['summary']>([])
  const [globalFlow, setGlobalFlow] = useState<number>(0)
  const [sumMasters, setSumMasters] = useState<number>(0)
  const [sumAdmins, setSumAdmins] = useState<number>(0)
  const [admins, setAdmins] = useState<IFilteredAdminsData['summary']>([])
  const [costs, setCosts] = useState<number>(0)
  const [cardMoney, setCardMoney] = useState<number>(0)
  const [cashMoney, setCashMoney] = useState<number>(0)
  const [payrollSum, setPayrollSum] = useState<number>(0)

  const loadData = useCallback(async () => {
    getAllWorks(month).then((res: IFilteredData) => {
      setWorks(res.summary)
      setGlobalFlow(res.globalFlow)
      setSumMasters(res.sumMasters)
    })
    getAdminsHours(month).then((res: IFilteredAdminsData) => {
      setAdmins(res.summary)
      setSumAdmins(res.sumAdmins)
    })
    getMoney(month).then((res: ICombineData) => {
      setCosts(res.sumCosts)
      setCardMoney(res.cardMoney)
      setCashMoney(res.cashMoney)
      setPayrollSum(res.payrollSum)
    })
  }, [month])

  useEffect(() => {
    loadData()
  }, [month, loadData])

  return (
    <section className={'pb-20'}>
      <Container size={'md'}>
        <div className={'flex justify-between flex-col md:flex-row items-center mb-10'}>
          <h2 className={'text-md1 mb-5 w-full text-center md:mb-0 md:text-left'}>
            {'Глобально денег с услуг'}
          </h2>
          <div>
            <span
              className={'text-[50px] font-bold whitespace-nowrap'}
            >{`${globalFlow.toLocaleString()} Kč`}</span>
          </div>
        </div>
        <Masters data={works} month={month} setMonth={setMonth} sumMasters={sumMasters} />
        <Administrators data={admins} sumAdmins={sumAdmins} />
        <Summary
          income={globalFlow}
          salary={sumMasters}
          salaryAdmin={sumAdmins}
          costs={costs}
          cash={cashMoney}
          card={cardMoney}
        />
        <Compare income={globalFlow} cash={cashMoney} card={cardMoney} payroll={payrollSum} />
      </Container>
    </section>
  )
}

export default GlobalMonthStates
