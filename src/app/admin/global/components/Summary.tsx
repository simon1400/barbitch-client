import { Cell } from '../../components/Cell'

export const Summary = ({
  income,
  salary,
  salaryAdmin,
  costs,
  cash,
  card,
  voucherPayed,
}: {
  income: number
  salary: number
  salaryAdmin: number
  costs: number
  cash: number
  card: number
  voucherPayed: number
}) => {
  return (
    <>
      <div className={'flex justify-between flex-col md:flex-row items-center mb-5'}>
        <h2 className={'text-md1 mb-5 w-full text-center md:mb-0 md:text-left'}>{'Summary'}</h2>
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
                <Cell title={'Дох. усл.'} asHeader />
                <Cell title={'Карта и кеш'} asHeader />
                <Cell title={'Воуч. куп.'} asHeader />
                <Cell title={'Мастерам'} asHeader />
                <Cell title={'Админам'} asHeader />
                <Cell title={'Затраты'} asHeader />
                <Cell title={'Результат'} asHeader />
              </tr>
            </thead>
            <tbody>
              <tr>
                <Cell title={`+ ${income.toLocaleString()} Kč`} />
                <Cell title={`+ ${(card + cash).toLocaleString()} Kč`} />
                <Cell title={`+ ${voucherPayed.toLocaleString()} Kč`} />
                <Cell title={`-${salary.toLocaleString()} Kč`} />
                <Cell title={`-${salaryAdmin.toLocaleString()} Kč`} />
                <Cell title={`-${costs.toLocaleString()} Kč`} />
                <Cell
                  title={`= ${(card + cash + voucherPayed - salary - salaryAdmin - costs).toLocaleString()} Kč`}
                />
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
