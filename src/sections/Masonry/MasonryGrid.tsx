/**
 * Zdivo (masonry) čistě v CSS.
 *
 * Dřív to byl `dynamic(..., { ssr: false })` nad `react-responsive-masonry`,
 * který na serveru nevykreslil nic — včetně children. Na `/blog` tak byl
 * v HTML jediný odkaz z patnácti a na hlavní stránce žádný; odkazy na články
 * existovaly jen v RSC payloadu. `columns` je serverově bezpečné a zvládne
 * totéž bez závislosti i bez klientského JS.
 *
 * Body zlomů odpovídají původním `columnsCountBreakPoints`
 * ({ 350: sm ?? 2, 750: 2, 900: 3 }).
 */
import { Children } from 'react'

export const MasonryGrid = ({
  children,
  sm,
  className = '',
}: {
  children: React.ReactNode[]
  sm?: number
  className?: string
}) => {
  // Třídy musí být zapsané staticky — `columns-${sm}` by JIT nevygeneroval.
  const baseColumns = sm === 1 ? 'columns-1' : 'columns-2'

  return (
    <div
      className={`${baseColumns} min-[750px]:columns-2 min-[900px]:columns-3 gap-5 ${className}`}
    >
      {Children.map(children, (child) => (
        <div className={'mb-5 break-inside-avoid'}>{child}</div>
      ))}
    </div>
  )
}
