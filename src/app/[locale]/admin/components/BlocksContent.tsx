import { BlockItem } from './BlockItem'

export const BlocksContent = ({
  title,
  items,
}: {
  title?: string
  items: { title: string; value: string | number }[]
}) => {
  return (
    <>
      {title && (
        <div className={'mb-5'}>
          <h2 className={'text-md1  w-full text-center md:mb-0 md:text-left'}>{title}</h2>
        </div>
      )}
      <div className={'grid grid-cols-3 gap-5 mb-10'}>
        {items.map((item) => (
          <BlockItem key={item.title} title={item.title} content={`${item.value}`} />
        ))}
      </div>
    </>
  )
}
