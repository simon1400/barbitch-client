import type { VoucherItem } from 'lib/vouchers'

import { getEngineCatalog } from 'app/book/fetch/engine'
import { buildVoucherCatalog } from 'lib/vouchers'

import { getServiceVouchers } from './voucher'

/**
 * Katalog voucherů pro stránku i API route (stejný zdroj → stejné ceny).
 * Výpadek katalogu rezervací nesmí shodit stránku — zůstanou vouchery na částku.
 */
export const getVoucherCatalog = async (): Promise<VoucherItem[]> => {
  const [groups, remote] = await Promise.all([
    getEngineCatalog().catch(() => []),
    getServiceVouchers(),
  ])
  return buildVoucherCatalog(groups, remote)
}
