import type { IEngineServiceGroup } from './fetch/engine'

import { BookServiceList } from './components/BookServiceList'
import { getEngineCatalog } from './fetch/engine'

// Каталог приходит из собственного движка (/api/engine/services): только
// active+onlineBookable услуги, уже сгруппированные по категориям — ни фильтра
// категорий, ни скрытия combo-услуг (как при Noona) больше не нужно.
//
// Страница индексируется и стоит в sitemap, поэтому каталог тянется на СЕРВЕРЕ:
// раньше он грузился из useEffect и в HTML был только скелетон.
export const revalidate = 300

const BookServicePage = async () => {
  let groups: IEngineServiceGroup[] = []
  let failed = false

  try {
    groups = (await getEngineCatalog()).filter((g) => g.services.length > 0)
  } catch (error) {
    // Výpadek enginu nesmí shodit stránku — klient nabídne „Zkusit znovu“.
    console.error('Failed to fetch engine catalog:', error)
    failed = true
  }

  return <BookServiceList initialGroups={groups} initialFailed={failed} />
}

export default BookServicePage
