export type ColKey = 'JUNIOR' | 'MASTER' | 'TOP MASTER'
export const getColumns = (
  items: { masterPrice?: string | null; topMasterPrice?: string | null }[],
): ColKey[] => {
  const hasMaster = items.some((i) => i.masterPrice != null)
  const hasTop = items.some((i) => i.topMasterPrice != null)
  return [
    'JUNIOR',
    ...(hasMaster ? ['MASTER' as const] : []),
    ...(hasTop ? ['TOP MASTER' as const] : []),
  ]
}

export const SHORT: Record<ColKey, string> = {
  JUNIOR: 'JUNR.',
  MASTER: 'MAST.',
  'TOP MASTER': 'TOP',
}
