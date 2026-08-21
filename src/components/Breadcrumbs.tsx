import { BreadcrumbSchema } from 'schemasOrg/breadcrumb'

import { Container } from './Container'

interface BreadcrumbItem {
  name: string
  url: string
}

/**
 * Drobečková navigace viditelná i pro člověka.
 *
 * Dřív existovala jen v JSON-LD — Google si ji tedy přečetl, návštěvník ale
 * neměl z článku cestu zpět. Schéma i viditelný seznam se tu staví z jednoho
 * pole, takže se nemůžou rozejít.
 */
export const Breadcrumbs = ({ items }: { items: BreadcrumbItem[] }) => {
  return (
    <>
      <BreadcrumbSchema items={items} />
      <Container size={'xl'}>
        <nav aria-label={'Drobečková navigace'} className={'py-4'}>
          <ol className={'flex flex-wrap items-center gap-x-2 gap-y-1 text-baseSm text-[#767676]'}>
            {items.map((item, index) => {
              const isLast = index === items.length - 1

              return (
                <li key={item.url} className={'flex items-center gap-x-2'}>
                  {isLast ? (
                    <span aria-current={'page'}>{item.name}</span>
                  ) : (
                    <>
                      <a className={'underline hover:text-primary duration-200'} href={item.url}>
                        {item.name}
                      </a>
                      <span aria-hidden={'true'}>{'/'}</span>
                    </>
                  )}
                </li>
              )
            })}
          </ol>
        </nav>
      </Container>
    </>
  )
}
