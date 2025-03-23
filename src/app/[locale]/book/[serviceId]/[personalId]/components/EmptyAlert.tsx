export const EmptyAlert = () => {
  return (
    <div
      className={
        'bg-[#E71E6E40] py-2 px-2.5 mt-5 max-w-[266px] text-center rounded-special-small mx-auto'
      }
    >
      <p className={'text-primary text-[14px]/[17px]'}>
        {'Tento den nebyly nalezeny žádné volné termíny.'}
      </p>
    </div>
  )
}
