'use client'
import type { IFilteredAdminsData } from '../fetch/allAdminsHours'
import type { IFilteredData } from '../fetch/allWorks'
import type { ICombineData } from '../fetch/costs'

import { Container } from 'components/Container'
import { useCallback, useEffect, useState } from 'react'

import { BlocksContent } from '../components/BlocksContent'
import { getAdminsHours } from '../fetch/allAdminsHours'
import { getAllWorks } from '../fetch/allWorks'
import { getMoney } from '../fetch/costs'
import { getEvents } from '../fetch/getEvents'

import { Administrators } from './components/Administrators'
import { Compare } from './components/Compare'
import { Masters } from './components/Masters'
import { Summary } from './components/Summary'
import { blockReservationsItems, blockStateItems } from './data'

const GlobalMonthStates = () => {
  const [month, setMonth] = useState<number>(new Date().getMonth())
  const [works, setWorks] = useState<IFilteredData['summary']>([])
  const [sumClientsDone, setSumClientsDone] = useState<number>(0)
  const [globalFlow, setGlobalFlow] = useState<number>(0)
  const [sumMasters, setSumMasters] = useState<number>(0)
  const [sumAdmins, setSumAdmins] = useState<number>(0)
  const [admins, setAdmins] = useState<IFilteredAdminsData['summary']>([])
  const [costs, setCosts] = useState<number>(0)
  const [noDphCosts, setNoDphCost] = useState<number>(0)
  const [cardMoney, setCardMoney] = useState<number>(0)
  const [cashMoney, setCashMoney] = useState<number>(0)
  const [payrollSum, setPayrollSum] = useState<number>(0)
  const [voucherRealized, setVoucherRealizedSum] = useState<number>(0)
  const [voucherPayed, setVoucherPayedSum] = useState<number>(0)
  const [clientsAll, setClientsAll] = useState<number>(0)
  const [clientsCanceled, setClientsCanceled] = useState<number>(0)
  const [clientsNoshow, setClientsNoshow] = useState<number>(0)
  const [clientsPayed, setClientsPayed] = useState<number>(0)
  const [clientsFree, setClientsFree] = useState<number>(0)
  const [clientsFixed, setClientsFixed] = useState<number>(0)
  const [clientsPersonal, setClientsPersonal] = useState<number>(0)

  const loadData = useCallback(async () => {
    getAllWorks(month).then((res: IFilteredData) => {
      setWorks(res.summary)
      setSumClientsDone(res.sumClientsDone)
      setGlobalFlow(res.globalFlow)
      setSumMasters(res.sumMasters)
    })
    getAdminsHours(month).then((res: IFilteredAdminsData) => {
      setAdmins(res.summary)
      setSumAdmins(res.sumAdmins)
    })
    getMoney(month).then((res: ICombineData) => {
      setCosts(res.sumCosts)
      setNoDphCost(res.sumNoDphCosts)
      setCardMoney(res.cardMoney)
      setCashMoney(res.cashMoney)
      setPayrollSum(res.payrollSum)
      setVoucherRealizedSum(res.voucherRealizedSum)
      setVoucherPayedSum(res.voucherPayedSum)
    })
    getEvents(month).then((res) => {
      setClientsAll(res.all)
      setClientsCanceled(res.cancelled)
      setClientsNoshow(res.noshow)
      setClientsPayed(res.payed)
      setClientsFree(res.free)
      setClientsFixed(res.fixed)
      setClientsPersonal(res.personal)
    })
  }, [month])

  useEffect(() => {
    loadData()
  }, [month, loadData])

  return (
    <section className={'pb-20'}>
      <Container size={'lg'}>
        <BlocksContent
          items={blockStateItems(
            noDphCosts,
            globalFlow,
            cashMoney,
            cardMoney,
            sumMasters,
            sumAdmins,
            costs,
            payrollSum,
            voucherRealized,
            voucherPayed,
          )}
        />
        <BlocksContent
          title={'Резервации'}
          items={blockReservationsItems(
            clientsAll,
            clientsPayed,
            clientsNoshow,
            clientsCanceled,
            clientsFree,
            clientsFixed,
            clientsPersonal,
            sumClientsDone,
          )}
        />
        <Masters data={works} month={month} setMonth={setMonth} sumMasters={sumMasters} />
        <Administrators data={admins} sumAdmins={sumAdmins} />
        <Summary
          income={globalFlow}
          salary={sumMasters}
          salaryAdmin={sumAdmins}
          costs={costs}
          cash={cashMoney}
          card={cardMoney}
          voucherPayed={voucherPayed}
        />
        <Compare
          income={globalFlow}
          cash={cashMoney}
          card={cardMoney}
          payroll={payrollSum}
          voucherRealized={voucherRealized}
        />
      </Container>
    </section>
  )
}

export default GlobalMonthStates
