import Button from 'components/Button'
import { Container } from 'components/Container'
import { PriceTable } from 'components/PriceTable'
import parse from 'html-react-parser'

export const PriceList = ({ data }: { data: any }) => {
  return (
    <>
      <section>
        <Container size={'lg'}>
          {data.title && <h2>{data.title}</h2>}
          <div>{parse(data.contentBefore, { trim: true })}</div>
        </Container>
      </section>
      <PriceTable data={[data.pricelistTable]} />
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
