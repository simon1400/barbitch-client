import { Cell } from '../../components/Cell'

export const Compare = ({
  income,
  cash,
  card,
  payroll,
  voucherRealized,
  extraMoney,
  qrMoney,
}: {
  income: number
  cash: number
  card: number
  payroll: number
  voucherRealized: number
  extraMoney: number
  qrMoney: number
}) => {
  return (
    <>
      <div className={'flex justify-between flex-col md:flex-row items-center mb-5'}>
        <h2 className={'text-md1 mb-5 w-full text-center md:mb-0 md:text-left'}>{'Сравнение'}</h2>
      </div>
      <div
        className={
          'relative flex flex-col w-full h-full overflow-hidden text-gray-700 bg-white shadow-md rounded-xl mb-10'
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
                {!!payroll && <Cell title={'Списывание'} asHeader />}
                <Cell title={'Сумма реал'} asHeader />
                <Cell title={'Доход адм'} asHeader />
                {!!voucherRealized && <Cell title={'Воуч. рлз.'} asHeader />}
                {!!qrMoney && <Cell title={'QR'} asHeader />}
                <Cell title={'Разница'} asHeader />
              </tr>
            </thead>
            <tbody>
              <tr>
                <Cell title={`+${card.toLocaleString()}`} />
                <Cell title={`+${cash.toLocaleString()}`} />
                {!!payroll && <Cell title={`+${payroll.toLocaleString()}`} />}
                <Cell title={`=${(card + cash + payroll).toLocaleString()}`} />
                <Cell title={`- ${income.toLocaleString()}`} />
                {!!voucherRealized && <Cell title={`+${voucherRealized.toLocaleString()}`} />}
                {!!qrMoney && <Cell title={`+${qrMoney.toLocaleString()}`} />}
                <Cell
                  title={`= ${(card + cash + payroll + voucherRealized + qrMoney - income).toLocaleString()}`}
                />
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
