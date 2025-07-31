import { Cell } from '../../components/Cell'

export const Summary = ({
  income,
  salary,
  salaryAdmin,
  costs,
  cash,
  card,
  voucherPayed,
  qrMoney,
}: {
  income: number
  salary: number
  salaryAdmin: number
  costs: number
  cash: number
  card: number
  voucherPayed: number
  qrMoney: number
}) => {
  return (
    <>
      <div className={'flex justify-between flex-col md:flex-row items-center mb-5'}>
        <h2 className={'text-md1 mb-5 w-full text-center md:mb-0 md:text-left'}>{'Summary'}</h2>
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
                <Cell title={'Дох. усл.'} asHeader />
                <Cell title={'Карта и кеш'} asHeader />
                {!!voucherPayed && <Cell title={'Воуч. куп.'} asHeader />}
                <Cell title={'Мастерам'} asHeader />
                <Cell title={'Админам'} asHeader />
                <Cell title={'Затраты'} asHeader />
                {!!qrMoney && <Cell title={'QR'} asHeader />}
                <Cell title={'Результат'} asHeader />
              </tr>
            </thead>
            <tbody>
              <tr>
                <Cell title={`+ ${income.toLocaleString()}`} />
                <Cell title={`+ ${(card + cash).toLocaleString()}`} />
                {!!voucherPayed && <Cell title={`+ ${voucherPayed.toLocaleString()}`} />}
                <Cell title={`-${salary.toLocaleString()}`} />
                <Cell title={`-${salaryAdmin.toLocaleString()}`} />
                <Cell title={`-${costs.toLocaleString()}`} />
                {!!qrMoney && <Cell title={`+ ${qrMoney.toLocaleString()}`} />}
                <Cell
                  title={`= ${(
                    card +
                    cash +
                    voucherPayed -
                    salary -
                    salaryAdmin -
                    costs +
                    qrMoney
                  ).toLocaleString('cz-CZ', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}`}
                />
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
