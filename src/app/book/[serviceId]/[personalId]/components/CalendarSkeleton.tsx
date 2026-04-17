export const CalendarSkeletonInner = () => (
  <div className={'animate-pulse'}>
    <div className={'flex justify-between items-center mb-4'}>
      <span className={'w-6 h-6 bg-[#3C3C3C] rounded block'} />
      <span className={'h-4 w-28 bg-[#3C3C3C] rounded block'} />
      <span className={'w-6 h-6 bg-[#3C3C3C] rounded block'} />
    </div>
    <div className={'grid grid-cols-7 gap-1 mb-2'}>
      {Array.from({ length: 7 }).map((_, i) => (
        <div key={i} className={'h-4 bg-[#3C3C3C] rounded mx-1'} />
      ))}
    </div>
    <div className={'grid grid-cols-7 gap-1 mb-5'}>
      {Array.from({ length: 35 }).map((_, i) => (
        <div key={i} className={'h-8 w-8 bg-[#3C3C3C] rounded-full mx-auto'} />
      ))}
    </div>
    <div className={'flex justify-center mb-5'}>
      <span className={'h-3 w-36 bg-[#3C3C3C] rounded block'} />
    </div>
    <div className={'flex flex-wrap gap-2'}>
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className={'h-9 w-16 bg-[#3C3C3C] rounded-special-small'} />
      ))}
    </div>
  </div>
)

const CalendarSkeleton = () => (
  <div className={'bg-[#252523] rounded-special-small px-7.5 py-5'}>
    <CalendarSkeletonInner />
  </div>
)

export default CalendarSkeleton
