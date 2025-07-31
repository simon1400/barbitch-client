import type { IFilteredData } from '../../fetch/allWorks'

import { findCommonZeroKeys } from 'helpers/findCommonZeroKeys'

import { Cell } from '../../components/Cell'

export const Masters = ({
  data,
  sumMasters,
}: {
  data: IFilteredData['summary']
  sumMasters: number
}) => {
  const emptyKeys = new Set(findCommonZeroKeys(data))
  return (
    <>
      <div className={'flex justify-between flex-col md:flex-row items-center mb-5'}>
        <h2 className={'text-md1 mb-5 w-full text-center md:mb-0 md:text-left'}>{'Мастера'}</h2>
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
                <Cell title={'Кл.'} asHeader />
                <Cell title={'Зарб.'} asHeader />
                {!emptyKeys.has('sumTip') && <Cell title={'Чай'} asHeader />}
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
                const result =
                  item.sum + item.sumTip + item.extraProfit - item.penalty - item.payrolls
                return (
                  <tr key={item.name} className={'hover:bg-gray-200'}>
                    <Cell title={item.name} />
                    <Cell title={`${item.countClient}`} />
                    <Cell title={`${item.sum.toLocaleString()}`} />
                    {!emptyKeys.has('sumTip') && (
                      <Cell title={item.sumTip ? `${item.sumTip.toLocaleString()}` : ''} />
                    )}
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
          >{`${sumMasters.toLocaleString()} Kč`}</span>
        </div>
      </div>
    </>
  )
}
