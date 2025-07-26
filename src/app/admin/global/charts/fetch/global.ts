import { getAdminsHours } from 'app/admin/fetch/allAdminsHours'
import { getAllWorks } from 'app/admin/fetch/allWorks'
import { getMoney } from 'app/admin/fetch/costs'

export const getGlobalStats = async () => {
  const globalStats = []
  for (let i = 2; i <= 6; i++) {
    const dataAllWorks = await getAllWorks(i)
    const dataCosts = await getMoney(i)
    const dataAdmin = await getAdminsHours(i)
    const item = {
      date: i + 1,
      flow: dataAllWorks.globalFlow,
      costs: dataCosts.sumNoDphCosts,
      masters: dataAllWorks.sumMasters,
      allCosts: dataCosts.sumNoDphCosts + dataAllWorks.sumMasters + dataAdmin.sumAdmins,
      result: (
        dataCosts.cashMoney +
        (dataCosts.voucherPayedSum + dataCosts.cardMoney) / 1.21 -
        dataAllWorks.sumMasters -
        dataAdmin.sumAdmins -
        dataCosts.sumNoDphCosts
      ).toFixed(2),
    }
    globalStats.push(item)
  }

  return {
    globalStats,
  }
}
