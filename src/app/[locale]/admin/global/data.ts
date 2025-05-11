export const blockStateItems = (
  globalFlow: number,
  cashMoney: number,
  cardMoney: number,
  sumMasters: number,
  sumAdmins: number,
  costs: number,
  payrollSum: number,
) => [
  {
    title: 'За услуги',
    value: `${globalFlow.toLocaleString()} Kč`,
  },
  {
    title: 'Результат за месяц',
    value: `${(cashMoney + cardMoney - sumMasters - sumAdmins - costs).toLocaleString()} Kč`,
  },
  {
    title: 'Разниця',
    value: `${(cardMoney + cashMoney + payrollSum - globalFlow).toLocaleString()}`,
  },
]

export const blockReservationsItems = (
  clientsAll: number,
  clientsPayed: number,
  clientsNoshow: number,
  clientsCanceled: number,
  clientsFree: number,
  clientsFixed: number,
  clientsPersonal: number,
  sumClientsDone: number,
) => [
  {
    title: 'Резервации все',
    value: clientsAll,
  },
  {
    title: 'Успешные',
    value: clientsPayed,
  },
  {
    title: 'Проведенные',
    value: sumClientsDone,
  },
  {
    title: 'Не пришли',
    value: clientsNoshow,
  },
  {
    title: 'Отменили',
    value: clientsCanceled,
  },
  {
    title: 'Бесплатные',
    value: clientsFree,
  },
  {
    title: 'Оправа',
    value: clientsFixed,
  },
  {
    title: 'Персонал',
    value: clientsPersonal,
  },
]
