'use client'

import { Container } from 'components/Container'
import { useEffect, useState } from 'react'


import { GlobalLineChart } from './components/GlobalLineChart'
import { getGlobalStats } from './fetch/global'

const GlobalMonthStats = () => {
  const [data, setData] = useState([])

  useEffect(() => {
    getGlobalStats().then((res: any) => setData(res.globalStats))
  }, [])

  return (
    <section className={'pb-20'}>
      <Container size={'lg'}>
        <GlobalLineChart
          data={data}
          title={'Result'}
          lines={[{ dataKey: 'result', stroke: 'green', name: 'Результат', strokeWidth: 5 }]}
        />
        <GlobalLineChart
          data={data}
          title={'Global'}
          lines={[
            { dataKey: 'flow', stroke: 'purple', name: 'Оборот' },
            { dataKey: 'allCosts', stroke: 'red', name: 'Все затраты' },
          ]}
        />
      </Container>
    </section>
  )
}

export default GlobalMonthStats
