import type { IFilteredData } from 'fetch/allWorks'

import { Cell } from '../../components/Cell'
import { Select } from '../../components/Select'

export const Masters = ({
  month,
  setMonth,
  data,
  sumMasters,
}: {
  month: number
  setMonth: (month: number) => void
  data: IFilteredData['summary']
  sumMasters: number
}) => {
  return (
    <>
      <div className={'flex justify-between flex-col md:flex-row items-center mb-5'}>
        <h2 className={'text-md1 mb-5 w-full text-center md:mb-0 md:text-left'}>{'Мастера'}</h2>
        <Select month={month} setMonth={setMonth} />
      </div>
      <div
        className={
          'relative flex flex-col w-full h-full overflow-hidden text-gray-700 bg-white shadow-md rounded-xl'
        }
      >
        <div
          className={
            'relative flex flex-col w-full h-full overflow-x-scroll md:overflow-hidden text-gray-700 bg-white shadow-md rounded-xl'
          }
        >
          <table className={'w-full text-left table-auto min-w-max'}>
            <thead>
              <tr>
                <Cell title={'Имя'} asHeader />
                <Cell title={'Кл.'} asHeader />
                <Cell title={'Зарб.'} asHeader />
                <Cell title={'Чай'} asHeader />
                <Cell title={'Штрафы'} asHeader />
                <Cell title={'Доп.'} asHeader />
                <Cell title={'Спис.'} asHeader />
                <Cell title={'Результат'} asHeader />
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr key={item.name}>
                  <Cell title={item.name} />
                  <Cell title={`${item.countClient}`} />
                  <Cell title={`${item.sum.toLocaleString()} Kč`} />
                  <Cell title={item.sumTip ? `${item.sumTip.toLocaleString()} Kč` : ''} />
                  <Cell title={item.penalty ? `-${item.penalty.toLocaleString()} Kč` : ''} />
                  <Cell title={item.extraProfit ? `${item.extraProfit.toLocaleString()} Kč` : ''} />
                  <Cell title={item.payrolls ? `-${item.payrolls.toLocaleString()} Kč` : ''} />
                  <Cell
                    title={`${(item.sum + item.sumTip + item.extraProfit - item.penalty - item.payrolls).toLocaleString()} Kč`}
                  />
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className={'flex justify-between flex-col md:flex-row items-center mt-2 mb-10'}>
        <h2 className={'text-[25px] mb-5 w-full text-center md:mb-0 md:text-left'}>
          {'Общая сумма'}
        </h2>
        <div>
          <span
            className={'text-[30px] font-bold whitespace-nowrap'}
          >{`${sumMasters.toLocaleString()} Kč`}</span>
        </div>
      </div>
    </>
  )
}
