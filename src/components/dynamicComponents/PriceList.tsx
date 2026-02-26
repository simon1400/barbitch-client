import Button from 'components/Button'
import { CenikTable } from 'components/CenikTable'
import { Container } from 'components/Container'
import { getBookingPricelist } from 'fetch/bookingPricelist'
import parse from 'html-react-parser'

export const PriceList = async ({ data }: { data: any }) => {
  const allGroups = await getBookingPricelist()

  // Filter by linked pricelist title — fuzzy match handles:
  // • emojis in Noona names ("Nehty 💅💅💅" matches "Nehty")
  // • inflected Czech forms ("Prodlužování řas" matches "Řasy" via stem "řas")
  const strapiTitle: string | undefined = data.pricelistTable?.title
  const matchTitle = (noonaTitle: string, filter: string): boolean => {
    const n = noonaTitle.toLowerCase()
    const f = filter.toLowerCase()
    if (n.includes(f) || f.includes(n)) return true
    return f
      .split(/\s+/)
      .filter((w) => w.length >= 3)
      .some((w) => n.includes(w.slice(0, 3)))
  }
  const groups = strapiTitle ? allGroups.filter((g) => matchTitle(g.title, strapiTitle)) : allGroups

  return (
    <>
      <section>
        <Container size={'lg'}>
          {data.title && <h2>{data.title}</h2>}
          {data.contentBefore && <div>{parse(data.contentBefore, { trim: true })}</div>}
        </Container>
      </section>

      <CenikTable groups={groups} />

      <section>
        <Container size={'lg'}>
          {!!data.contentAfter && <div>{parse(data.contentAfter, { trim: true })}</div>}
          {data.cta && (
            <div className={'mb-17 mt-10'}>
              <Button text={data.cta.title} href={data.cta.link} />
            </div>
          )}
        </Container>
      </section>
    </>
  )
}
