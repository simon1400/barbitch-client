import type { IDataWorks } from 'fetch/works'

import React from 'react'

import { Cell } from './Cell'
import { TableBody } from './TableBody'

export const Table = ({ data }: { data: IDataWorks['offersDone'] }) => (
  <div
    className={
      'relative flex flex-col w-full h-full overflow-x-scroll md:overflow-hidden text-gray-700 bg-white shadow-md rounded-xl'
    }
  >
    <table className={'w-full text-left table-auto min-w-max'}>
      <thead>
        <tr>
          <Cell title={'#'} asHeader />
          <Cell title={'Дата'} asHeader />
          <Cell title={'Имя клиента'} asHeader />
          <Cell title={'Заработанные деньги'} asHeader />
          <Cell title={'Чаевые'} asHeader />
        </tr>
      </thead>
      {data && <TableBody data={data} />}
    </table>
  </div>
)
