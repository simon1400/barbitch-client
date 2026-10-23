import { ChevronLeft, ChevronRight } from 'lucide-react'
import { BreadcrumbSchema } from 'schemasOrg/breadcrumb'

import { Container } from './Container'

interface BreadcrumbItem {
  name: string
  url: string
  /** `false` — jen pro návštěvníka, do JSON-LD se nepropíše (např. „Služby“ → ceník). */
  schema?: false
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
  /** Odkaz „‹ Zpět na …“. Když chybí, odvodí se z předposlední položky `items`. */
  back?: { label: string; url: string }
  /** Sousední položka v sekci. Když chybí, pravá část má jen „Zpět“. */
  next?: { prefix: string; label: string; url: string }
}

const backOf = (items: BreadcrumbItem[]): BreadcrumbsProps['back'] => {
  const parent = items[items.length - 2]
  if (!parent) return undefined
  return {
    label: items.length === 2 ? 'Zpět na hlavní stranu' : `Zpět na ${parent.name}`,
    url: parent.url,
  }
}

const actionLink = 'group flex items-center gap-2 text-resXs uppercase tracking-[.06em]'
const chevron = 'shrink-0 relative -top-px'

/**
 * Drobečková navigace viditelná i pro člověka.
 *
 * Dřív existovala jen v JSON-LD — Google si ji tedy přečetl, návštěvník ale
 * neměl z článku cestu zpět. Schéma i viditelný seznam se tu staví z jednoho
 * pole, takže se nemůžou rozejít.
 *
 * Sedí přímo pod herem — hero na takových stránkách dostává `noMargin`.
 */
export const Breadcrumbs = ({ items, back, next }: BreadcrumbsProps) => {
  const backLink = back ?? backOf(items)

  return (
    <>
      <BreadcrumbSchema items={items.filter((item) => item.schema !== false)} />
      <Container size={'xl'} className={'mb-13.5'}>
        <nav
          aria-label={'Drobečková navigace'}
          className={
            'flex justify-between items-center gap-6 py-3 md:py-4 border-b-[1.5px] border-[#1616154D]'
          }
        >
          <ol className={'flex flex-wrap items-center gap-x-3 gap-y-1 text-xs1 text-accent'}>
            {items.map((item, index) => {
              const isLast = index === items.length - 1

              return (
                <li key={item.url} className={'flex items-center gap-x-3'}>
                  {isLast ? (
                    <span aria-current={'page'} className={'font-bold'}>
                      {item.name}
                    </span>
                  ) : (
                    <>
                      <a className={'hover:text-primary duration-200'} href={item.url}>
                        {item.name}
                      </a>
                      <span aria-hidden={'true'} className={'text-primary font-bold'}>
                        {'/'}
                      </span>
                    </>
                  )}
                </li>
              )
            })}
          </ol>

          {!!backLink && (
            <div className={'hidden md:flex items-center gap-6 shrink-0'}>
              <a
                className={`${actionLink} whitespace-nowrap text-accent hover:text-primary duration-200`}
                href={backLink.url}
              >
                <ChevronLeft size={14} strokeWidth={2.5} aria-hidden={'true'} className={chevron} />
                {backLink.label}
              </a>
              {!!next && (
                <>
                  <span aria-hidden={'true'} className={'w-[1.5px] h-4 bg-[#1616154D]'} />
                  <a className={`${actionLink} max-w-[22rem]`} href={next.url}>
                    <span>
                      <span className={'text-[#767676]'}>{next.prefix}</span>{' '}
                      <span className={'text-accent group-hover:text-primary duration-200'}>
                        {next.label}
                      </span>
                    </span>
                    <ChevronRight
                      size={14}
                      strokeWidth={2.5}
                      aria-hidden={'true'}
                      className={`${chevron} text-accent group-hover:text-primary duration-200`}
                    />
                  </a>
                </>
              )}
            </div>
          )}
        </nav>
      </Container>
    </>
  )
}
