export const BlockItem = ({ title, content }: { title: string; content: string }) => {
  return (
    <div className={'rounded-xl shadow-lg bg-white p-5 w-full'}>
      <div>
        <span className={'text-sm text-primary'}>{title}</span>
      </div>
      <div>
        <span className={'text-md'}>{content}</span>
      </div>
    </div>
  )
}
