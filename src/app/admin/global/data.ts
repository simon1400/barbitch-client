export const blockStateItems = (
  noDphCosts: number,
  globalFlow: number,
  cashMoney: number,
  cardMoney: number,
  sumMasters: number,
  sumAdmins: number,
  payrollSum: number,
  voucherRealized: number,
  voucherPayed: number,
  qrMoney: number,
) => [
  {
    title: 'За услуги',
    value: `${globalFlow.toLocaleString()} Kč`,
  },
  {
    title: 'Результат за месяц',
    value: `${(
      cashMoney +
      (voucherPayed + cardMoney + qrMoney) / 1.21 -
      sumMasters -
      sumAdmins -
      noDphCosts
    ).toLocaleString('cz-CZ', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`,
  },
  {
    title: 'Разниця',
    value: `${(cardMoney + cashMoney + payrollSum + voucherRealized + qrMoney - globalFlow).toLocaleString()} Kč`,
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
  clientsPastPayed: number,
) => [
  {
    title: 'Резервации все',
    value: clientsAll,
  },
  {
    title: 'Реалз. / Все Платные',
    value: `${clientsPastPayed} / ${clientsPayed}`,
  },
  {
    title: 'Осталось платных',
    value: `${clientsPayed - clientsPastPayed}`,
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
