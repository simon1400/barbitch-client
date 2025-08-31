'use client'

import { Container } from 'components/Container'
import { useEffect, useState } from 'react'

import { GlobalLineChart } from './components/GlobalLineChart'
import { getGlobalStats } from './fetch/global'

const GlobalMonthStats = () => {
  const [data, setData] = useState([])
  const [totalResult, setTotalResult] = useState<number>(0)

  useEffect(() => {
    getGlobalStats().then((res: any) => {
      setData(res.globalStats)
      setTotalResult(
        res.globalStats.reduce((sum: number, item: any) => sum + Number(item.result || 0), 0),
      )
    })
  }, [])

  return (
    <section className={'pb-20'}>
      <Container size={'lg'}>
        <h3 className={'text-md mb-5'}>{`= ${totalResult.toLocaleString()} Kc`}</h3>
        <GlobalLineChart
          data={data}
          title={'Result'}
          lines={[{ dataKey: 'result', stroke: 'green', name: 'Результат', strokeWidth: 5 }]}
        />
        <GlobalLineChart
          data={data}
          title={'Global'}
          lines={[
            { dataKey: 'flow', stroke: 'green', name: 'Оборот' },
            { dataKey: 'allCosts', stroke: 'red', name: 'Все затраты' },
            { dataKey: 'allCostsWhithotAdmins', stroke: 'blue', name: 'Затраты без админов' },
            { dataKey: 'costs', stroke: 'purple', name: 'Затраты на салон' },
          ]}
        />
        <GlobalLineChart
          data={data}
          title={'Затраты сотрудники'}
          lines={[
            { dataKey: 'masters', stroke: 'orange', name: 'Затраты мастера' },
            { dataKey: 'admins', stroke: 'purple', name: 'Затраты админы' },
          ]}
        />
      </Container>
    </section>
  )
}

export default GlobalMonthStats
