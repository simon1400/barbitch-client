/* eslint-disable sonarjs/no-commented-code */
import type { IDataPriceList } from 'fetch/pricelist'

import { Container } from './Container'

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
            // const hasTopMaster = item.some((el) => el.topMasterPrice !== null)
            // const hasMaster = item.some((el) => el.masterPrice !== null)
            // const count = hasTopMaster ? 2 : hasMaster ? 1 : 0
            const count = 0
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
                {(!!tableTitle?.length || count > 0) && (
                  <thead>
                    <tr className={'border-b-[1.5px] border-[#1616154D]'}>
                      <th
                        className={
                          'text-left text-sm11 font-bold md:text-sm1 py-2 md:py-3.5 pr-2 md:pr-3.5 w-full'
                        }
                        colSpan={2}
                      >
                        {tableTitle}
                      </th>
                      <th className={`text-sm1 md:text-sm11${count > 0 ? 'p-2 md:p-3.5' : ''}`}>
                        {count > 0 ? 'JUNIOR' : ''}
                      </th>
                      {/* {count >= 1 && (
                        <th className={'text-sm1 md:text-sm11 p-2 md:p-3.5'}>{'MASTER'}</th>
                      )}
                      {count === 2 && (
                        <th className={'text-sm1 md:text-sm11 py-2 md:py-3.5 pl-2 md:pl-3.5'}>
                          {'TOP MASTER'}
                        </th>
                      )} */}
                    </tr>
                  </thead>
                )}
                <tbody>
                  {item.map(({ title, juniorPrice, linkRezervation }) => (
                    <tr
                      key={title}
                      className={
                        'text-right text-sm font-normal md:text-sm11 border-b-[1.5px] border-[#1616154D]'
                      }
                    >
                      <td className={'text-left py-2 md:py-3.5 pr-2 md:pr-3.5 w-full'}>{title}</td>
                      <td
                        className={
                          'font-bold whitespace-nowrap p-2 md:p-3.5 inline-flex items-center'
                        }
                      >
                        {!!linkRezervation && (
                          <a
                            href={linkRezervation}
                            id={'book-button'}
                            className={'text-[10px] font-bold text-primary mr-7 hover:underline'}
                          >
                            <span className={'hidden md:inline'}>{'Rezervace'}</span>
                            <span className={'md:hidden inline-block w-5 h-5'}>
                              <img src={'/assets/icons/calendar.svg'} />
                            </span>
                          </a>
                        )}
                        <span>{juniorPrice}</span>
                      </td>
                      {/* {count >= 1 && (
                          <td className={'font-bold p-2 md:p-3.5 whitespace-nowrap'}>
                            {masterPrice}
                          </td>
                        )}
                        {count === 2 && (
                          <td className={'font-bold pl-2 md:pl-3.5 whitespace-nowrap'}>
                            {topMasterPrice}
                          </td>
                        )} */}
                    </tr>
                  ))}
                </tbody>
              </table>
            )
          })}
        </div>
      ))}
      <div className={'max-w-[300px] -mt-[50px] mb-[50px]'}>
        <img src={'/assets/icons/payCard.svg'} />
      </div>
    </Container>
  )
}
