// import parse from 'html-react-parser'
import { getPriceList } from 'fetch/pricelist'
import { Metadata } from 'next'

import { Top } from 'sections/Top'

export const metadata: Metadata = {
  title: 'Bar.bitch - ceník',
  description: 'Bar.bitch - ceník',
}

const PriceList = async () => {
  const data = await getPriceList()

  return (
    <main>
      <Top title={'Ceník'} small />
      <section className={'pt-20 pb-16'}>
        <div className={'container mx-auto w-full max-w-[900px] px-4'}>
          {data.map((tableCategory) => (
            <div key={tableCategory.title} className={'pb-15'}>
              {tableCategory.table.map((table, tableIdx) => {
                const foundTopMaster = table.item.some((el) => el.topMasterPrice !== null)
                let count = 0
                if (!foundTopMaster) {
                  const foundMaster = table.item.some((el) => el.masterPrice !== null)
                  if (foundMaster) {
                    count = 1
                  }
                } else {
                  count = 2
                }
                return (
                  <table key={table.title} className={'w-full table-auto border-collapse mb-5'}>
                    {!tableIdx && (
                      <caption className={'caption-top text-md2 text-left mb-5'}>
                        {tableCategory.title}
                      </caption>
                    )}
                    <thead>
                      <tr className={'border-b-[1.5px] whitespace-nowrap border-[#1616154D]'}>
                        <th className={'text-left text-sm1 py-3.5 pr-3.5 w-full'}>{table.title}</th>
                        <th className={'text-sm11 p-3.5'}>{count === 0 ? '' : 'JUNIOR'}</th>
                        {(count === 1 || count === 2) && (
                          <th className={'text-sm11 p-3.5'}>{'MASTER'}</th>
                        )}
                        {count === 2 && (
                          <th className={'text-sm11 py-3.5 pl-3.5'}>{'TOP MASTER'}</th>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {table.item.map((item) => (
                        <tr
                          key={item.title}
                          className={
                            'text-right text-sm11 border-b-[1.5px] whitespace-nowrap border-[#1616154D]'
                          }
                        >
                          <td className={'text-left py-3.5 w-full pr-3.5'}>{item.title}</td>
                          <td className={'font-bold p-3.5'}>{item.juniorPrice}</td>
                          {(count === 1 || count === 2) && (
                            <td className={'font-bold p-3.5'}>{item.masterPrice}</td>
                          )}
                          {count === 2 && (
                            <td className={'font-bold pl-3.5'}>{item.topMasterPrice}</td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )
              })}
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}

export default PriceList
