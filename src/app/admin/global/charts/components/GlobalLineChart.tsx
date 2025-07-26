'use client'

import { CartesianGrid, Legend, Line, LineChart, Tooltip, XAxis, YAxis } from 'recharts'

interface Props {
  data: any[]
  lines: {
    dataKey: string
    stroke: string
    name: string
    strokeWidth?: number
  }[]
  title: string
}

export const GlobalLineChart = ({ data, lines, title }: Props) => (
  <div className={'mb-10'}>
    <h2 className={'text-md1 mb-5 w-full text-center md:text-left'}>{title}</h2>
    <LineChart width={868} height={300} data={data}>
      <CartesianGrid stroke={'#aaa'} strokeDasharray={'5 5'} />
      <XAxis dataKey={'date'} />
      <YAxis />
      <Tooltip />
      <Legend align={'right'} />
      {lines.map((line) => (
        <Line key={line.dataKey} type={'monotone'} {...line} strokeWidth={line.strokeWidth ?? 2} />
      ))}
    </LineChart>
  </div>
)
