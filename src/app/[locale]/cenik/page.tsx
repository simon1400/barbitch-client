import type { Metadata } from 'next'

import { Container } from 'components/Container'
import { getLinkToReserve } from 'fetch/contact'
import { getPricelistMeta } from 'fetch/getMeta'
import { getPriceList, getPricelistPage } from 'fetch/pricelist'
import parse from 'html-react-parser'
import { CalendarIcon } from 'icons/Calendar'
import { Top } from 'sections/Top/Top'

export async function generateMetadata(): Promise<Metadata> {
  const { metaData } = await getPricelistMeta()

  return {
    title: metaData.title,
    description: metaData.description,
    openGraph: {
      title: metaData.title || 'Ceník',
      description: metaData.description || '',
      siteName: 'Barbitch',
      images: [metaData.image ? metaData.image.url : 'https://barbitch.cz/assets/bigBaner.jpg'],
      url: `https://barbitch.cz/cenik`,
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: metaData.title || 'Ceník',
      description: metaData.description || '',
      images: [metaData.image ? metaData.image.url : 'https://barbitch.cz/assets/bigBaner.jpg'],
    },
    keywords: [
      'barbitch',
      'bar.bitch',
      'Cenik',
      'Brno',
      'Manikúra',
      'Prodlužování řas',
      'Úprava obočí',
    ],
    alternates: {
      canonical: `https://barbitch.cz/cenik`,
    },
  }
}

const PriceList = async () => {
  const [data, dataPage, dataLink] = await Promise.all([
    getPriceList(),
    getPricelistPage(),
    getLinkToReserve(),
  ])

  return (
    <main>
      <Top title={dataPage.title} small linkToReserve={dataLink.linkToReserve} />
      <section className={'pb-16'}>
        <Container size={'lg'}>
          {dataPage.contentText && (
            <div className={'w-full mb-20 text-xs1 lg:text-base'}>
              {parse(dataPage.contentText, { trim: true })}
            </div>
          )}
        </Container>
        <Container size={'lg'}>
          {data.map(({ title: categoryTitle, table }) => (
            <div key={categoryTitle} className={'pb-15'}>
              {table.map(({ title: tableTitle, item }, tableIdx) => {
                const hasTopMaster = item.some((el) => el.topMasterPrice !== null)
                const hasMaster = item.some((el) => el.masterPrice !== null)
                const count = hasTopMaster ? 2 : hasMaster ? 1 : 0

                return (
                  <table
                    key={tableTitle}
                    className={'w-full max-w-full table-auto border-collapse mb-5'}
                  >
                    {!tableIdx && categoryTitle && (
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
                          {count >= 1 && (
                            <th className={'text-sm1 md:text-sm11 p-2 md:p-3.5'}>{'MASTER'}</th>
                          )}
                          {count === 2 && (
                            <th className={'text-sm1 md:text-sm11 py-2 md:py-3.5 pl-2 md:pl-3.5'}>
                              {'TOP MASTER'}
                            </th>
                          )}
                        </tr>
                      </thead>
                    )}
                    <tbody>
                      {item.map(
                        ({ title, juniorPrice, masterPrice, topMasterPrice, linkRezervation }) => (
                          <tr
                            key={title}
                            className={
                              'text-right text-sm font-normal md:text-sm11 border-b-[1.5px] border-[#1616154D]'
                            }
                          >
                            <td className={'text-left py-2 md:py-3.5 pr-2 md:pr-3.5 w-full'}>
                              {title}
                            </td>
                            <td
                              className={
                                'font-bold whitespace-nowrap p-2 md:p-3.5 inline-flex items-center'
                              }
                            >
                              {!!linkRezervation && (
                                <a
                                  href={linkRezervation}
                                  id={'book-button'}
                                  className={
                                    'text-[10px] font-bold text-primary mr-7 hover:underline'
                                  }
                                >
                                  <span className={'hidden md:inline'}>{'Rezervace'}</span>
                                  <span className={'md:hidden inline-block w-5 h-5'}>
                                    <CalendarIcon />
                                  </span>
                                </a>
                              )}
                              <span>{juniorPrice}</span>
                            </td>
                            {count >= 1 && (
                              <td className={'font-bold p-2 md:p-3.5 whitespace-nowrap'}>
                                {masterPrice}
                              </td>
                            )}
                            {count === 2 && (
                              <td className={'font-bold pl-2 md:pl-3.5 whitespace-nowrap'}>
                                {topMasterPrice}
                              </td>
                            )}
                          </tr>
                        ),
                      )}
                    </tbody>
                  </table>
                )
              })}
            </div>
          ))}
        </Container>
      </section>
    </main>
  )
}

export default PriceList
