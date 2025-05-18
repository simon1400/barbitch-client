import Button from 'components/Button'
import { Container } from 'components/Container'
import parse from 'html-react-parser'

export const Text = ({
  data,
}: {
  data: { title?: string; contentText: string; cta?: { title: string; link: string } }
}) => {
  return (
    <section className={'mb-11'}>
      <Container size={'lg'}>
        <div>
          {data.title && <h2>{data.title}</h2>}
          <div>{parse(data.contentText, { trim: true })}</div>
          {data.cta && (
            <div className={'mb-17 mt-10'}>
              <Button text={data.cta.title} href={data.cta.link} />
            </div>
          )}
        </div>
      </Container>
    </section>
  )
}
