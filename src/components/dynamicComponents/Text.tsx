import Button from 'components/Button'
import { Container } from 'components/Container'
import { parseHtml } from 'lib/parseHtml'

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
          <div>{parseHtml(data.contentText)}</div>
          {data.cta && (
            <div className={'mb-17 mt-10'}>
              {/* Dlouhý text tlačítka se na telefonu zalomí místo přetečení přes okraj. */}
              <Button
                text={data.cta.title}
                href={data.cta.link}
                className={'max-w-full !text-wrap !h-auto min-h-[48px] md:min-h-[57px]'}
              />
            </div>
          )}
        </div>
      </Container>
    </section>
  )
}
