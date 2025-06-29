import { getMonthRange } from 'helpers/getMounthRange'
import qs from 'qs'

import { Axios } from '../../../lib/api'

interface IDataCosts {
  sum: number
  noDph?: number
}
interface IDataCash {
  profit: string
}

export interface ICombineData {
  sumCosts: number
  sumNoDphCosts: number
  cardMoney: number
  cashMoney: number
  payrollSum: number
  voucherRealizedSum: number
  voucherPayedSum: number
  extraMoneySum: number
}

export const getMoney = async (month: number) => {
  const { firstDay, lastDay } = getMonthRange(2025, month)

  const filters = {
    date: {
      $gte: firstDay.toISOString(),
      $lte: lastDay.toISOString(),
    },
  }

  const pagination = {
    page: 1,
    pageSize: 40,
  }

  const queryCostsAndMoney = qs.stringify(
    {
      filters,
      fields: ['sum', 'noDph'],
      pagination,
    },
    {
      encodeValuesOnly: true,
    },
  )

  const queryMoney = qs.stringify(
    {
      filters,
      fields: ['sum'],
      pagination,
    },
    {
      encodeValuesOnly: true,
    },
  )

  const queryCashMoney = qs.stringify(
    {
      filters,
      fields: ['profit'],
      pagination,
    },
    {
      encodeValuesOnly: true,
    },
  )

  const queryVouchersRealized = qs.stringify(
    {
      filters: {
        dateRealized: {
          $gte: firstDay.toISOString(),
          $lte: lastDay.toISOString(),
        },
      },
      fields: ['sum'],
      pagination,
    },
    {
      encodeValuesOnly: true,
    },
  )
  const queryVouchersPayed = qs.stringify(
    {
      filters: {
        datePay: {
          $gte: firstDay.toISOString(),
          $lte: lastDay.toISOString(),
        },
      },
      fields: ['sum'],
      pagination,
    },
    {
      encodeValuesOnly: true,
    },
  )

  const dataCosts: IDataCosts[] = await Axios.get(`/api/costs?${queryCostsAndMoney}`)
  const dataCard: IDataCosts[] = await Axios.get(`/api/card-profits?${queryMoney}`)
  const dataExtra: IDataCosts[] = await Axios.get(`/api/extra-profits?${queryMoney}`)
  const dataCash: IDataCash[] = await Axios.get(`/api/cashs?${queryCashMoney}`)
  const dataPayroll: IDataCosts[] = await Axios.get(`/api/payrolls?${queryMoney}`)
  const dataVouchersRealized: IDataCosts[] = await Axios.get(
    `/api/vouchers?${queryVouchersRealized}`,
  )
  const dataVouchersPayed: IDataCosts[] = await Axios.get(`/api/vouchers?${queryVouchersPayed}`)

  const maxProfit = dataCash.reduce((max, item) => {
    const profit = Number(item.profit) || 0
    return Math.max(max, profit)
  }, 0)

  const sumCosts = dataCosts.reduce((acc, item) => acc + Number(item.sum), 0)
  const sumNoDphCosts = dataCosts.reduce((acc, item) => acc + Number(item.noDph), 0)
  const extraMoneySum = dataExtra.reduce((acc, item) => acc + Number(item.sum), 0)
  const payrollSum = dataPayroll.reduce((acc, item) => acc + Number(item.sum), 0)
  const voucherRealizedSum = dataVouchersRealized.reduce((acc, item) => acc + Number(item.sum), 0)
  const voucherPayedSum = dataVouchersPayed.reduce((acc, item) => acc + Number(item.sum), 0)

  return {
    sumCosts,
    sumNoDphCosts,
    cardMoney: +dataCard[0].sum,
    cashMoney: +maxProfit,
    payrollSum,
    voucherRealizedSum,
    voucherPayedSum,
    extraMoneySum,
  }
}
