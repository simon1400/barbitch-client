import { Axios } from 'lib/api'

export interface IMasterPriority {
  noonaEmployeeId: string
  bookingPriority: number
}

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

export const selectMasterByPriority = (
  employeeIds: string[],
  priorities: IMasterPriority[],
): string => {
  if (employeeIds.length <= 1) return employeeIds[0]

  const priorityMap = new Map(priorities.map((p) => [p.noonaEmployeeId, p]))

  // Find max priority among available masters
  const maxPriority = Math.max(
    ...employeeIds.map((id) => priorityMap.get(id)?.bookingPriority ?? 0),
  )

  // Get all with max priority
  const topCandidates = employeeIds.filter(
    (id) => (priorityMap.get(id)?.bookingPriority ?? 0) === maxPriority,
  )

  // Random among same-priority masters
  // eslint-disable-next-line sonarjs/pseudo-random
  return topCandidates[Math.floor(Math.random() * topCandidates.length)]
}
