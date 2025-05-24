export const blockStateItems = (
  noDphCosts: number,
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
    value: `${(cashMoney + cardMoney - sumMasters - sumAdmins - costs).toLocaleString()}`,
    addValue: `${(cashMoney + cardMoney / 1.21 - sumMasters - sumAdmins - noDphCosts).toLocaleString()}`,
  },
  {
    title: 'Разниця',
    value: `${(cardMoney + cashMoney + payrollSum - globalFlow).toLocaleString()} Kč`,
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
    title: 'Реалз. / Все Платные',
    value: `${sumClientsDone - clientsPersonal - clientsFree - clientsFixed} / ${clientsPayed}`,
  },
  {
    title: 'Осталось платных',
    value: `${clientsPayed - (sumClientsDone - clientsPersonal - clientsFree - clientsFixed)}`,
  },
  {
    title: 'Все проведенные',
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
