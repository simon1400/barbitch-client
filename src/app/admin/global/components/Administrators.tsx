import type { IFilteredAdminsData } from '../../fetch/allAdminsHours'

import { Cell } from '../../components/Cell'

export const Administrators = ({
  data,
  sumAdmins,
}: {
  data: IFilteredAdminsData['summary']
  sumAdmins: number
}) => {
  return (
    <>
      <div className={'flex justify-between flex-col md:flex-row items-center mb-5'}>
        <h2 className={'text-md1 mb-5 w-full text-center md:mb-0 md:text-left'}>
          {'Администраторы'}
        </h2>
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
                <Cell title={'Часов'} asHeader />
                <Cell title={'Зароботок'} asHeader />
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
                  <Cell title={`${item.sum.toLocaleString()} hod`} />
                  <Cell title={`${(item.sum * 115).toLocaleString()} Kč`} />
                  <Cell title={item.penalty ? `-${item.penalty.toLocaleString()} Kč` : ''} />
                  <Cell title={item.extraProfit ? `${item.extraProfit.toLocaleString()} Kč` : ''} />
                  <Cell title={item.payrolls ? `-${item.payrolls.toLocaleString()} Kč` : ''} />
                  <Cell
                    title={`${(item.sum * 115 + item.extraProfit - item.penalty - item.payrolls).toLocaleString()} Kč`}
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
          >{`${sumAdmins.toLocaleString()} Kč`}</span>
        </div>
      </div>
    </>
  )
}
