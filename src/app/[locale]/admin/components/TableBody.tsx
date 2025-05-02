import type { IDataWorks } from 'fetch/works'

import { formatDate } from 'helpers/parseDate'
import React from 'react'

import { Cell } from './Cell'

export const TableBody = ({ data }: { data: IDataWorks['offersDone'] }) => (
  <tbody>
    {data.map((item, idx) => (
      <tr key={item.id}>
        <Cell title={`${idx + 1}.`} />
        <Cell title={formatDate(item.date)} />
        <Cell title={item.clientName} />
        <Cell title={`${item.staffSalaries} Kč`} />
        <Cell title={item.tip?.length ? `${item.tip} Kč` : ''} />
      </tr>
    ))}
  </tbody>
)
