import type { IFilteredAdminsData } from '../../fetch/allAdminsHours'

import { findCommonZeroKeys } from 'helpers/findCommonZeroKeys'

import { Cell } from '../../components/Cell'

export const Administrators = ({
  data,
  sumAdmins,
}: {
  data: IFilteredAdminsData['summary']
  sumAdmins: number
}) => {
  const emptyKeys = new Set(findCommonZeroKeys(data))
  console.log(data)
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
            'relative flex flex-col w-full h-full overflow-x-scroll text-gray-700 bg-white shadow-md rounded-xl'
          }
        >
          <table className={'w-full text-left table-auto min-w-max'}>
            <thead>
              <tr>
                <Cell title={'Имя'} asHeader />
                <Cell title={'Часов'} asHeader />
                <Cell title={'Зароботок'} asHeader />
                {!emptyKeys.has('penalty') && <Cell title={'Штрафы'} asHeader />}
                {!emptyKeys.has('extraProfit') && <Cell title={'Доп.'} asHeader />}
                {!emptyKeys.has('payrolls') && <Cell title={'Спис.'} asHeader />}
                <Cell title={'Результат'} asHeader />
                {!emptyKeys.has('advance') && <Cell title={'Аванс'} asHeader />}
                {!emptyKeys.has('salaries') && <Cell title={'ЗП.'} asHeader />}
                {!emptyKeys.has('advance') && <Cell title={'Осталось'} asHeader />}
              </tr>
            </thead>
            <tbody>
              {data.map((item) => {
                const result = item.sum * 115 + item.extraProfit - item.penalty - item.payrolls
                const splitName = item.name.split(' ')
                return (
                  <tr key={item.name} className={'hover:bg-gray-200'}>
                    <Cell title={`${splitName[0][0]}. ${splitName[1]}`} />
                    <Cell title={`${item.sum.toLocaleString()} hod`} />
                    <Cell title={`${(item.sum * 115).toLocaleString()}`} />
                    {!emptyKeys.has('penalty') && (
                      <Cell title={item.penalty ? `-${item.penalty.toLocaleString()}` : ''} />
                    )}
                    {!emptyKeys.has('extraProfit') && (
                      <Cell
                        title={item.extraProfit ? `${item.extraProfit.toLocaleString()}` : ''}
                      />
                    )}
                    {!emptyKeys.has('payrolls') && (
                      <Cell title={item.payrolls ? `-${item.payrolls.toLocaleString()}` : ''} />
                    )}
                    <Cell className={'text-primary'} title={`${result.toLocaleString()}`} />
                    {!emptyKeys.has('advance') && (
                      <Cell title={item.advance ? `-${item.advance.toLocaleString()}` : ''} />
                    )}
                    {!emptyKeys.has('salaries') && (
                      <Cell title={item.salaries ? `-${item.salaries.toLocaleString()}` : ''} />
                    )}
                    {(!emptyKeys.has('advance') || !emptyKeys.has('salaries')) && (
                      <Cell
                        className={'text-primary'}
                        title={`${(result - item.advance - item.salaries).toLocaleString()}`}
                      />
                    )}
                  </tr>
                )
              })}
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
