import Button from 'components/Button'
import parse from 'html-react-parser'

export const Text = ({
  data,
}: {
  data: { title?: string; contentText: string; cta?: { text: string; link: string } }
}) => {
  return (
    <section>
      <div className={'container mx-auto w-full max-w-[840px] px-4'}>
        <div>
          {data.title && <h2>{data.title}</h2>}
          <div>{parse(data.contentText, { trim: true })}</div>
          {data.cta && (
            <div className={'mb-17 mt-10'}>
              <Button text={data.cta.text} href={data.cta.link} />
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
