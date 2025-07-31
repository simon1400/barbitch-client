'use client'
import type { IFilteredAdminsData } from '../fetch/allAdminsHours'
import type { IFilteredData } from '../fetch/allWorks'
// import type { ICombineData } from '../fetch/costs'
import type { GroupedSum } from '../fetch/fetchHelpers'

import { useCallback, useEffect, useState } from 'react'

import { getAdminsHours } from '../fetch/allAdminsHours'
import { getAllWorks } from '../fetch/allWorks'
import { getMoney } from '../fetch/costs'
import { getEvents } from '../fetch/getEvents'

export const useGlobalMonthData = (month: number) => {
  const [data, setData] = useState({
    works: [] as IFilteredData['summary'],
    admins: [] as IFilteredAdminsData['summary'],
    sumClientsDone: 0,
    globalFlow: 0,
    sumMasters: 0,
    sumAdmins: 0,
    daysResult: [] as GroupedSum[],
    costs: 0,
    noDphCosts: 0,
    cardMoney: 0,
    cashMoney: 0,
    payrollSum: 0,
    voucherRealized: 0,
    voucherPayed: 0,
    extraMoney: 0,
    qrMoney: 0,
    clients: {
      all: 0,
      canceled: 0,
      noshow: 0,
      payed: 0,
      pastPayed: 0,
      free: 0,
      fixed: 0,
      personal: 0,
    },
    dataMetrics: [],
  })

  const loadData = useCallback(async () => {
    const [worksRes, adminsRes, moneyRes, eventsRes] = await Promise.all([
      getAllWorks(month),
      getAdminsHours(month),
      getMoney(month),
      getEvents(month),
    ])

    setData({
      works: worksRes.summary,
      sumClientsDone: worksRes.sumClientsDone,
      globalFlow: worksRes.globalFlow,
      sumMasters: worksRes.sumMasters,
      daysResult: worksRes.daysResult,
      admins: adminsRes.summary,
      sumAdmins: adminsRes.sumAdmins,
      costs: moneyRes.sumCosts,
      noDphCosts: moneyRes.sumNoDphCosts,
      cardMoney: moneyRes.cardMoney,
      cashMoney: moneyRes.cashMoney,
      payrollSum: moneyRes.payrollSum,
      voucherRealized: moneyRes.voucherRealizedSum,
      voucherPayed: moneyRes.voucherPayedSum,
      extraMoney: moneyRes.extraMoneySum,
      qrMoney: moneyRes.qrMoney,
      clients: {
        all: eventsRes.all,
        canceled: eventsRes.cancelled,
        noshow: eventsRes.noshow,
        payed: eventsRes.payed,
        pastPayed: eventsRes.pastPayed,
        free: eventsRes.free,
        fixed: eventsRes.fixed,
        personal: eventsRes.personal,
      },
      dataMetrics: eventsRes.dataMetrics,
    })
  }, [month])

  useEffect(() => {
    loadData()
  }, [loadData])

  return data
}
