import { addDays, format } from 'date-fns'
import { Axios } from 'lib/api'

export interface IMasterPriority {
  noonaEmployeeId: string
  bookingPriority: number
}

// employeeId → { 'yyyy-MM-dd': кол-во активных броней этого мастера в этот день }
export type EmployeeLoad = Record<string, Record<string, number>>

// На сколько броней «фора» даёт 1 пункт приоритета. Чем выше — тем сильнее
// ручной буст перебивает разницу в загрузке. owner может крутить это значение.
const PRIORITY_BOOST_WEIGHT = 2

// Радиус скользящего окна в днях вокруг даты слота (±3 → окно ~неделя).
const LOAD_WINDOW_RADIUS_DAYS = 3

export const getMasterPriorities = async (): Promise<IMasterPriority[]> => {
  try {
    const data: any[] = await Axios.get(
      '/api/personals?fields[0]=noonaEmployeeId&fields[1]=bookingPriority&filters[isActive][$eq]=true&pagination[pageSize]=100&status=published',
    )

    return (data || [])
      .filter((item: any) => item.noonaEmployeeId)
      .map((item: any) => ({
        noonaEmployeeId: item.noonaEmployeeId,
        bookingPriority: item.bookingPriority ?? 0,
      }))
  } catch {
    return []
  }
}

// Сумма броней мастера в скользящем окне вокруг даты слота.
const windowLoad = (loadByDate: Record<string, number> | undefined, slotDate: Date): number => {
  if (!loadByDate) return 0
  let sum = 0
  for (let offset = -LOAD_WINDOW_RADIUS_DAYS; offset <= LOAD_WINDOW_RADIUS_DAYS; offset++) {
    const key = format(addDays(slotDate, offset), 'yyyy-MM-dd')
    sum += loadByDate[key] || 0
  }
  return sum
}

// Выбор мастера для "Kdokoliv": балансировка по загрузке + ручной буст приоритета.
// Эффективная загрузка = реальная загрузка − приоритет×вес. Меньше = выгоднее.
// Высокий приоритет снижает эффективную загрузку → мастера выбирают чаще даже
// при чуть большей реальной загрузке. При равных эффективных загрузках — рандом.
// Если данных о загрузке нет (пустая карта / сбой HQ) — все load=0, и выбор
// сводится к «высший приоритет, среди равных рандом» (прежнее поведение).
export const selectMaster = (
  employeeIds: string[],
  priorities: IMasterPriority[],
  employeeLoad: EmployeeLoad,
  slotDate: Date,
): string => {
  if (employeeIds.length <= 1) return employeeIds[0]

  const priorityMap = new Map(priorities.map((p) => [p.noonaEmployeeId, p.bookingPriority]))

  const scored = employeeIds.map((id) => {
    const load = windowLoad(employeeLoad[id], slotDate)
    const boost = (priorityMap.get(id) ?? 0) * PRIORITY_BOOST_WEIGHT
    return { id, score: load - boost }
  })

  const minScore = Math.min(...scored.map((s) => s.score))
  const topCandidates = scored.filter((s) => s.score === minScore).map((s) => s.id)

  // eslint-disable-next-line sonarjs/pseudo-random
  return topCandidates[Math.floor(Math.random() * topCandidates.length)]
}
