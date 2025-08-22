import type { IDataPriceList } from 'fetch/pricelist'

import { Container } from 'components/Container'
import React from 'react'

import { BookButton } from './BookButton'
import { getColumns, SHORT } from './helpers'

const BORDER = 'border-b-[1.5px] border-[#1616154D]'
const TD_BASE = 'whitespace-nowrap font-bold'
const HEAD_TXT = 'text-right text-xss md:text-sm11'
const TITLE_TD = 'text-left py-1 md:py-3.5 pr-1 md:pr-3.5 w-full'
const CELL_PAD = 'p-1 md:p-3.5'

export const PriceTable = ({
  data,
  showTitle,
}: {
  data: IDataPriceList[]
  showTitle?: boolean
}) => {
  return (
    <Container size={'lg'}>
      {data.map(({ title: categoryTitle, table }) => (
        <div key={categoryTitle} className={'pb-15'}>
          {table.map(({ title: tableTitle, item }, tableIdx) => {
            const cols = getColumns(item)
            const hasCols = cols.length > 1 || (cols.length === 1 && tableTitle?.length)

            return (
              <table
                key={tableTitle}
                className={'w-full max-w-full table-auto border-collapse mb-5'}
              >
                {showTitle && !tableIdx && categoryTitle && (
                  <caption className={'caption-top text-md2 text-left mb-5'}>
                    {categoryTitle}
                  </caption>
                )}

                {hasCols && (
                  <thead>
                    <tr className={BORDER}>
                      <th
                        className={
                          'text-left text-sm11 font-bold md:text-sm1 py-2 md:py-3.5 pr-2 md:pr-3.5 w-full'
                        }
                        colSpan={2}
                      >
                        {tableTitle}
                      </th>
                      {cols.map((c, i) => (
                        <th
                          key={c}
                          className={`${HEAD_TXT} ${i === 0 ? 'p-1 md:p-3.5' : 'py-1 md:py-3.5 pl-1 md:pl-3.5'}`}
                        >
                          <span className={'hidden md:inline'}>{c}</span>
                          <span className={'md:hidden'}>{SHORT[c]}</span>
                        </th>
                      ))}
                    </tr>
                  </thead>
                )}

                <tbody>
                  {item.map(
                    ({ title, juniorPrice, linkRezervation, masterPrice, topMasterPrice }) => {
                      const spanJuniorOverMaster =
                        cols.length === 2 && cols[1] === 'MASTER' && !masterPrice
                      return (
                        <tr
                          key={title}
                          className={`text-right text-sm font-normal md:text-sm11 ${BORDER}`}
                        >
                          <td className={TITLE_TD}>{title}</td>

                          <td className={`${TD_BASE} ${CELL_PAD}`}>
                            <BookButton href={linkRezervation} />
                          </td>

                          {/* JUNIOR */}
                          <td
                            className={`${TD_BASE} ${CELL_PAD}`}
                            colSpan={spanJuniorOverMaster ? 2 : 1}
                          >
                            {juniorPrice}
                          </td>

                          {/* MASTER (render empty cell to keep grid unless spanned) */}
                          {cols.includes('MASTER') && !spanJuniorOverMaster && (
                            <td className={`${TD_BASE} ${CELL_PAD}`}>{masterPrice ?? ''}</td>
                          )}

                          {/* TOP MASTER */}
                          {cols.includes('TOP MASTER') && (
                            <td className={`${TD_BASE} pl-1 md:pl-3.5`}>{topMasterPrice ?? ''}</td>
                          )}
                        </tr>
                      )
                    },
                  )}
                </tbody>
              </table>
            )
          })}
        </div>
      ))}

      <div className={'max-w-[300px] -mt-[50px] mb-[50px]'}>
        <img src={'/assets/icons/payCard.svg'} alt={'Pay cards icons'} />
      </div>
    </Container>
  )
}
