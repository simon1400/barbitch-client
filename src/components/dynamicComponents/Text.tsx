import parse from 'html-react-parser'

export const Text = ({ data }: { data: { title?: string; contentText: string } }) => {
  return (
    <section>
      <div className={'container mx-auto w-full max-w-[840px] px-4'}>
        <div>
          {data.title && <h2>{data.title}</h2>}
          <div>{parse(data.contentText, { trim: true })}</div>
        </div>
      </div>
    </section>
  )
}
