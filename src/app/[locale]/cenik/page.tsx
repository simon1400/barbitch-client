import type { Metadata } from 'next'

import { getPricelistMeta } from 'fetch/getMeta'
// import parse from 'html-react-parser'
import { getPriceList, getPricelistPage } from 'fetch/pricelist'
import parse from 'html-react-parser'
import { Top } from 'sections/Top'
export async function generateMetadata(): Promise<Metadata> {
  const data = await getPricelistMeta()

  return {
    title: data.metaData.title,
    description: data.metaData.description,
    openGraph: data.metaData.image
      ? {
          images: [data.metaData.image.url],
        }
      : null,
  }
}

const PriceList = async () => {
  const data = await getPriceList()
  const dataPage = await getPricelistPage()

  return (
    <main>
      <Top title={dataPage.title} small />
      <section className={'pt-20 pb-16'}>
        <div className={'container mx-auto w-full max-w-[900px] px-4'}>
          {dataPage.contentText && (
            <div className={'w-full mb-20'}>
              <div className={'text-xs1 lg:text-base'}>
                {parse(dataPage.contentText, { trim: true })}
              </div>
            </div>
          )}
        </div>
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
                  <table
                    key={table.title}
                    className={'w-full max-w-full table-auto border-collapse mb-5'}
                  >
                    {!tableIdx && !!tableCategory.title?.length && (
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
                          className={'text-right text-sm11 border-b-[1.5px] border-[#1616154D]'}
                        >
                          <td className={'text-left py-3.5 w-full pr-3.5'}>{item.title}</td>
                          <td className={'font-bold whitespace-nowrap p-3.5'}>
                            {item.juniorPrice}
                          </td>
                          {(count === 1 || count === 2) && (
                            <td className={'font-bold p-3.5 whitespace-nowrap'}>
                              {item.masterPrice}
                            </td>
                          )}
                          {count === 2 && (
                            <td className={'font-bold pl-3.5 whitespace-nowrap'}>
                              {item.topMasterPrice}
                            </td>
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
