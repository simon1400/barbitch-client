import { Cell } from '../../components/Cell'

export const Compare = ({
  income,
  cash,
  card,
  payroll,
}: {
  income: number
  cash: number
  card: number
  payroll: number
}) => {
  return (
    <>
      <div className={'flex justify-between flex-col md:flex-row items-center mb-5'}>
        <h2 className={'text-md1 mb-5 w-full text-center md:mb-0 md:text-left'}>{'Сравнение'}</h2>
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
                <Cell title={'Карта'} asHeader />
                <Cell title={'Нал'} asHeader />
                <Cell title={'Списывание'} asHeader />
                <Cell title={'Сумма реал'} asHeader />
                <Cell title={'Доход адм'} asHeader />
                <Cell title={'Разница'} asHeader />
              </tr>
            </thead>
            <tbody>
              <tr>
                <Cell title={`+${card.toLocaleString()} Kč`} />
                <Cell title={`+${cash.toLocaleString()} Kč`} />
                <Cell title={`+${payroll.toLocaleString()} Kč`} />
                <Cell title={`=${(card + cash + payroll).toLocaleString()} Kč`} />
                <Cell title={`${income.toLocaleString()} Kč`} />
                <Cell title={`${(income - (card + cash + payroll)).toLocaleString()}`} />
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
