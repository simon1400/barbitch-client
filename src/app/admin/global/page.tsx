'use client'
import { Container } from 'components/Container'
import { useState } from 'react'

import { BlocksContent } from '../components/BlocksContent'
import { Select } from '../components/Select'
import { useGlobalMonthData } from '../hooks/useGlobalMonthData'

import { GlobalLineChart } from './charts/components/GlobalLineChart'
import { Administrators } from './components/Administrators'
import { Compare } from './components/Compare'
import { Masters } from './components/Masters'
import { Summary } from './components/Summary'
import { blockReservationsItems, blockStateItems } from './data'

const GlobalMonthStates = () => {
  const [month, setMonth] = useState<number>(new Date().getMonth())
  const data = useGlobalMonthData(month)

  return (
    <section className={'pb-20'}>
      <Container size={'lg'}>
        <div className={'mb-10'}>
          <Select month={month} setMonth={setMonth} />
        </div>

        <BlocksContent
          items={blockStateItems(
            data.noDphCosts,
            data.globalFlow,
            data.cashMoney,
            data.cardMoney,
            data.sumMasters,
            data.sumAdmins,
            data.payrollSum,
            data.voucherRealized,
            data.voucherPayed,
            data.qrMoney,
            data.extraMoney,
          )}
        />

        <BlocksContent
          title={'Резервации'}
          items={blockReservationsItems(
            data.clients.all,
            data.clients.payed,
            data.clients.noshow,
            data.clients.canceled,
            data.clients.free,
            data.clients.fixed,
            data.clients.personal,
            data.sumClientsDone,
            data.clients.pastPayed,
          )}
        />

        <GlobalLineChart
          data={data.daysResult}
          title={'Услуги'}
          lines={[{ dataKey: 'sum', stroke: '#e71e6e', name: 'Сумма' }]}
        />

        <GlobalLineChart
          data={data.dataMetrics}
          title={'Записи'}
          lines={[{ dataKey: 'count', stroke: '#161615', name: 'Резервации' }]}
        />

        <Masters data={data.works} sumMasters={data.sumMasters} />
        <Administrators data={data.admins} sumAdmins={data.sumAdmins} />

        <Compare
          income={data.globalFlow}
          cash={data.cashMoney}
          card={data.cardMoney}
          payroll={data.payrollSum}
          voucherRealized={data.voucherRealized}
          extraMoney={data.extraMoney}
          qrMoney={data.qrMoney}
        />

        <Summary
          income={data.globalFlow}
          salary={data.sumMasters}
          salaryAdmin={data.sumAdmins}
          costs={data.noDphCosts}
          cash={data.cashMoney}
          card={data.cardMoney / 1.21}
          voucherPayed={data.voucherPayed}
          qrMoney={data.qrMoney / 1.21}
        />
      </Container>
    </section>
  )
}

export default GlobalMonthStates
